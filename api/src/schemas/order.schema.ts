import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, HydratedDocument, Model } from 'mongoose'
import { Task } from './task.schema'

export type OrderDocument = Order & Document

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean

  @Prop({
    type: String,
    unique: true,
  })
  orderNumber: string

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  })
  client: mongoose.Types.ObjectId

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
  })
  stock: mongoose.Types.ObjectId

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        description: { type: String },
        amount: { type: Number, required: true },
      },
    ],
    required: true,
  })
  products: {
    product: mongoose.Types.ObjectId
    description: string
    amount: number
  }[]

  @Prop({ required: true })
  price: number

  @Prop({ required: true })
  sent_at: Date

  @Prop({ type: String, required: false, default: null })
  delivered_at?: string

  @Prop()
  comment: string

  @Prop({ default: null })
  documents: [{ document: string }]

  @Prop({
    type: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        change: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now },
      },
    ],
    default: [],
  })
  logs: {
    user: mongoose.Types.ObjectId
    change: string
    date: Date
  }[]

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        defect_description: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    default: [],
  })
  defects: {
    product: mongoose.Types.ObjectId
    defect_description: string
    amount: number
  }[]

  @Prop({
    type: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
        service_amount: { type: Number, required: true, default: 1 },
        service_price: { type: Number, required: false },
        service_type: { type: String, required: true },
      },
    ],
    default: [],
  })
  services: {
    service: mongoose.Types.ObjectId
    service_amount: number
    service_price: number
    service_type: string
  }[]

  @Prop({
    type: String,
    enum: ['в сборке', 'в пути', 'доставлен'],
    default: 'в сборке',
  })
  status: 'в сборке' | 'в пути' | 'доставлен'
}


const OrderSchema = SchemaFactory.createForClass(Order)

OrderSchema.virtual('invoice', {
  ref: 'Invoice',
  localField: '_id',
  foreignField: 'associatedOrder',
  justOne: true,
})

export const OrderSchemaFactory = (
  taskModel: Model<Task>,
) => {
  const cascadeArchive = async (order: HydratedDocument<Order>) => {
    const tasks = await taskModel.find({ associated_order: order._id })

    await Promise.all([
      ...tasks.map(x => x.updateOne({ isArchived: true })),
    ])
  }

  const cascadeDelete = async (order: HydratedDocument<Order>) => {
    const tasks = await taskModel.find({ associated_order: order._id })

    await Promise.all([
      ...tasks.map(x => x.deleteOne()),
    ])
  }

  OrderSchema.pre('findOneAndUpdate', async function () {
    const order = await this.model.findOne<HydratedDocument<Order>>(this.getQuery())

    if (!order) return
    const update = this.getUpdate()

    if (update && 'isArchived' in update && update.isArchived) {
      await cascadeArchive(order)
    }
  })

  OrderSchema.pre('updateOne', async function () {
    const order = await this.model.findOne<HydratedDocument<Order>>(this.getQuery())

    if (!order) return

    const update = this.getUpdate()

    if (update && 'isArchived' in update && update.isArchived) {
      await cascadeArchive(order)
    }
  })

  OrderSchema.pre('save', async function () {
    if (this.isModified('isArchived') && this.isArchived) {
      await cascadeArchive(this)
    }
  })

  OrderSchema.pre('findOneAndDelete', async function () {
    const order = await this.model.findOne<HydratedDocument<Order>>(this.getQuery())

    if (!order) return

    await cascadeDelete(order)
  })

  OrderSchema.pre('deleteOne', async function () {
    const order = await this.model.findOne<HydratedDocument<Order>>(this.getQuery())

    if (!order) return

    await cascadeDelete(order)
  })

  return OrderSchema
}

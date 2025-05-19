import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, HydratedDocument, Model } from 'mongoose'
import { Task } from './task.schema'

export type ArrivalDocument = Arrival & Document

@Schema({ timestamps: true })
export class Arrival {
  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean

  @Prop({
    type: String,
    unique: true,
  })
  arrivalNumber: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  })
  client: mongoose.Types.ObjectId

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        description: { type: String, default: null },
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

  @Prop({
    type: String,
    enum: ['ожидается доставка', 'получена', 'отсортирована'],
    default: 'ожидается доставка',
  })
  arrival_status: 'ожидается доставка' | 'получена' | 'отсортирована'

  @Prop({ required: true })
  arrival_date: Date

  @Prop({ default: null })
  sent_amount: string

  @Prop({ default: null })
  pickup_location: string

  @Prop({ default: null })
  documents: [{ document: string }]

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counterparty',
    required: false,
  })
  shipping_agent?: mongoose.Types.ObjectId | null

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true,
  })
  stock: mongoose.Types.ObjectId

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
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        description: { type: String, default: null },
        amount: { type: Number, required: true },
      },
    ],
    default: [],
  })
  received_amount: {
    product: mongoose.Types.ObjectId
    description: string
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

  @Prop({ default: null }) comment: string

}

const ArrivalSchema = SchemaFactory.createForClass(Arrival)

export const ArrivalSchemaFactory = (
  taskModel: Model<Task>,
) => {
  const cascadeArchive = async (arrival: HydratedDocument<Arrival>) => {
    const tasks = await taskModel.find({ associated_arrival: arrival._id })

    await Promise.all([
      ...tasks.map(x => x.updateOne({ isArchived: true })),
    ])
  }

  const cascadeDelete = async (arrival: HydratedDocument<Arrival>) => {
    const tasks = await taskModel.find({ associated_arrival: arrival._id })

    await Promise.all([
      ...tasks.map(x => x.deleteOne()),
    ])
  }

  ArrivalSchema.pre('findOneAndUpdate', async function () {
    const arrival = await this.model.findOne<HydratedDocument<Arrival>>(this.getQuery())

    if (!arrival) return
    const update = this.getUpdate()

    if (update && 'isArchived' in update && update.isArchived) {
      await cascadeArchive(arrival)
    }
  })

  ArrivalSchema.pre('updateOne', async function () {
    const arrival = await this.model.findOne<HydratedDocument<Arrival>>(this.getQuery())

    if (!arrival) return

    const update = this.getUpdate()

    if (update && 'isArchived' in update && update.isArchived) {
      await cascadeArchive(arrival)
    }
  })

  ArrivalSchema.pre('save', async function () {
    if (this.isModified('isArchived') && this.isArchived) {
      await cascadeArchive(this)
    }
  })

  ArrivalSchema.pre('findOneAndDelete', async function () {
    const arrival = await this.model.findOne<HydratedDocument<Arrival>>(this.getQuery())

    if (!arrival) return

    await cascadeDelete(arrival)
  })

  ArrivalSchema.pre('deleteOne', async function () {
    const arrival = await this.model.findOne<HydratedDocument<Arrival>>(this.getQuery())

    if (!arrival) return

    await cascadeDelete(arrival)
  })

  return ArrivalSchema
}

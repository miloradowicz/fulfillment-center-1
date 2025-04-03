import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

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
  client: string

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
  })
  stock: mongoose.Schema.Types.ObjectId

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
    product: mongoose.Schema.Types.ObjectId
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
    user: mongoose.Schema.Types.ObjectId
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
    product: mongoose.Schema.Types.ObjectId
    defect_description: string
    amount: number
  }[]

  @Prop({
    type: String,
    enum: ['в сборке', 'в пути', 'доставлен'],
    default: 'в сборке',
  })
  status: 'в сборке' | 'в пути' | 'доставлен'
}


export const OrderSchema = SchemaFactory.createForClass(Order)

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type StockDocument = Stock & Document

@Schema({ timestamps: true })
export class Stock {
  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  address: string

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        amount: { type: Number, required: true },
      },
    ],
    default: [],
  })
  products: {
    product: mongoose.Types.ObjectId
    amount: number
  }[]

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        amount: { type: Number, required: true },
      },
    ],
    default: [],
  })
  defects: {
    product: mongoose.Types.ObjectId
    amount: number
  }[]

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        amount: { type: Number, required: true },
        reason: { type: String, required: true },
      },
    ],
    default: [],
  })
  write_offs: {
    product: mongoose.Types.ObjectId
    amount: number
    reason: string
  }[]

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
}

export const StockSchema = SchemaFactory.createForClass(Stock)

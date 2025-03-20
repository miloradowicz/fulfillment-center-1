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
        description: { type: String },
        amount: { type: Number, required: true },
      },
    ],
    default: [],
  })
  products: {
    product: mongoose.Schema.Types.ObjectId
    description: string
    amount: number
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
    user: mongoose.Schema.Types.ObjectId
    change: string
    date: Date
  }[]
}

export const StockSchema = SchemaFactory.createForClass(Stock)

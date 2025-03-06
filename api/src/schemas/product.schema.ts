import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type ProductDocument = Product & Document

@Schema()
export class Product {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  })
  client: string
  @Prop({ required: true })
  title: string
  @Prop({ required: true })
  amount: number
  @Prop({ required: true })
  barcode: string
  @Prop({ required: true })
  article: string
  @Prop()
  documents: [{ document: string }]
  @Prop()
  dynamic_fields: [
    {
      key: { type: string; unique: true }
      label: string
      value: string
    },
  ]
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

export const ProductSchema = SchemaFactory.createForClass(Product)

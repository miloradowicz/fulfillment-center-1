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
  @Prop()
  logs: [
    {
      user: { type: mongoose.Schema.Types.ObjectId; ref: 'User' }
      change: string
      date: { type: Date }
    },
  ]
}

export const ProductSchema = SchemaFactory.createForClass(Product)

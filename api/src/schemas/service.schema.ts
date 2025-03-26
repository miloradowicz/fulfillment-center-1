import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type ServiceDocument = Service & Document

@Schema()
export class Service {
  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean

  @Prop({ required: true })
  name: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
    required: true,
  })
  serviceCategory: mongoose.Schema.Types.ObjectId

  @Prop({
    type: Number,
    required: true,
  })
  price: number

  @Prop()
  description: string

  @Prop({
    type: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        change: { type: String, required: true },
        date: { type: Date, default: Date.now },
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

export const ServiceSchema = SchemaFactory.createForClass(Service)

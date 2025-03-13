import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type ServiceDocument = Service & Document

@Schema()
export class Service {
  @Prop({ required: true })
  name: string

  @Prop({
    type: [
      {
        key: { type: String, required: true, unique: true },
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    required: true,
  })
  dynamic_fields: {
    key: string
    label: string
    value: string
  }[]

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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document, HydratedDocument } from 'mongoose'

export type ServiceDocument = Service & Document

@Schema()
export class Service {
  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean

  @Prop({
    required: true,
    validate: {
      validator: async function (this: HydratedDocument<Service>, value: string) {
        return !this.isModified('name') || !(await this.model().findOne({ name: value }))
      },
      message: 'Название услуги должно быть уникальным',
    },
  })
  name: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
    required: true,
  })
  serviceCategory: mongoose.Types.ObjectId

  @Prop({
    type: Number,
    required: true,
  })
  price: number

  @Prop()
  description: string

  @Prop({
    type: String,
    enum: ['внутренняя', 'внешняя'],
    required: true,
    default: 'внутренняя',
  })
  type: 'внутренняя' | 'внешняя'

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
    user: mongoose.Types.ObjectId
    change: string
    date: Date
  }[]
}

export const ServiceSchema = SchemaFactory.createForClass(Service)

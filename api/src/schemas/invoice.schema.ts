import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type InvoiceDocument = Invoice & Document

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Boolean, default: false })
  isArchived: boolean

  @Prop({ type: String, unique: true, required: true })
  invoiceNumber: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  client: mongoose.Types.ObjectId

  @Prop({
    type: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
        service_amount: { type: Number, required: true, default: 1 },
        service_price: { type: Number, required: false },
      },
    ],
    required: true,
  })
  services: {
    service: mongoose.Schema.Types.ObjectId
    service_amount: number
    service_price?: number
  }[]

  @Prop({ type: Number, required: true })
  totalAmount: number

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'partially_paid'],
    default: 'pending',
  })
  status: 'pending' | 'paid' | 'partially_paid'

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Arrival', required: false })
  associatedArrival?: mongoose.Types.ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: false })
  associatedOrder?: mongoose.Types.ObjectId

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

export const InvoiceSchema = SchemaFactory.createForClass(Invoice)

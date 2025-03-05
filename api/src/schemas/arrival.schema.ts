import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type ArrivalDocument = Arrival & Document

@Schema({ timestamps: true })
export class Arrival {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  })
  client: mongoose.Schema.Types.ObjectId

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
    product: mongoose.Schema.Types.ObjectId
    description: string
    amount: number
  }[]

  @Prop({ required: true })
  arrival_price: number

  @Prop({
    type: String,
    enum: ['Ожидается доставка', 'Получен', 'Отсортирован'],
    default: 'Ожидается доставка',
  })
  arrival_status: 'Ожидается доставка' | 'Получен' | 'Отсортирован'

  @Prop({ required: true })
  arrival_date: Date

  @Prop({ required: true })
  sent_amount: string

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
    product: mongoose.Schema.Types.ObjectId
    description: string
    amount: number
  }[]
}

export const ArrivalSchema = SchemaFactory.createForClass(Arrival)

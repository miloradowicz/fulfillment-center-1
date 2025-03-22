import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type CounterDocument = Document & Counter

@Schema()
export class Counter {
  @Prop({ required: true, unique: true })
  name: string
  @Prop({ required: true, default: 0 })
  seq: number
}

export const CounterSchema = SchemaFactory.createForClass(Counter)

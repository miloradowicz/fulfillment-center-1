import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type CounterpartyDocument = Counterparty & Document

@Schema()
export class Counterparty {

  @Prop({ required: true , unique: true  }) name: string

  @Prop({ default: null }) phone_number: string

  @Prop({ default: null }) address: string

  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean
}

export const CounterpartySchema = SchemaFactory.createForClass(Counterparty)

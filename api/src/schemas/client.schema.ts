import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type ClientDocument = Client & Document

@Schema()
export class Client {
  @Prop({ required: true, unique: true }) name: string

  @Prop({ required: true }) phone_number: string

  @Prop({ required: true }) email: string

  @Prop({ required: true }) inn: string

  @Prop({ default: null }) address: string

  @Prop({ default: null }) banking_data: string

  @Prop({ default: null }) ogrn: string
}

export const ClientSchema = SchemaFactory.createForClass(Client)

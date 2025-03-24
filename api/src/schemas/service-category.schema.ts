import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type ServiceCategoryDocument = ServiceCategory & Document

@Schema()
export class ServiceCategory {
  @Prop({ type: String, required: true, unique: true }) name: string

  @Prop({ type: Boolean, default: false }) isArchived: boolean
}

export const ServiceCategorySchema = SchemaFactory.createForClass(ServiceCategory)

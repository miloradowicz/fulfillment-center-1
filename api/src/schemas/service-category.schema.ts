import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Service } from './service.schema'
import { HydratedDocument, Model } from 'mongoose'

export type ServiceCategoryDocument = ServiceCategory & Document

@Schema()
export class ServiceCategory {
  @Prop({ type: String, required: true, unique: true }) name: string

  @Prop({ type: Boolean, default: false }) isArchived: boolean
}

const ServiceCategorySchema = SchemaFactory.createForClass(ServiceCategory)

export const ServiceCategorySchemaFactory = (
  serviceModel: Model<Service>
) => {
  const cascadeArchive = async (serviceCategory: HydratedDocument<ServiceCategory>) => {
    const services = await serviceModel.find({ serviceCategory: serviceCategory._id })

    await Promise.all([...services.map(x => x.updateOne({ isArchived: true }))])
  }

  const cascadeDelete = async (serviceCategory: HydratedDocument<ServiceCategory>) => {
    const services = await serviceModel.find({ serviceCategory: serviceCategory._id })

    await Promise.all([
      ...services.map(x => x.deleteOne()),
    ])
  }

  ServiceCategorySchema.pre('findOneAndUpdate', async function () {
    const serviceCategory = await this.model.findOne<HydratedDocument<ServiceCategory>>(this.getQuery())

    if (!serviceCategory) return
    const update = this.getUpdate()

    if (update && 'isArchived' in update && update.isArchived) {
      await cascadeArchive(serviceCategory)
    }
  })

  ServiceCategorySchema.pre('updateOne', async function () {
    const serviceCategory = await this.model.findOne<HydratedDocument<ServiceCategory>>(this.getQuery())

    if (!serviceCategory) return

    const update = this.getUpdate()

    if (update && 'isArchived' in update && update.isArchived) {
      await cascadeArchive(serviceCategory)
    }
  })

  ServiceCategorySchema.pre('save', async function () {
    if (this.isModified('isArchived') && this.isArchived) {
      await cascadeArchive(this)
    }
  })

  ServiceCategorySchema.pre('findOneAndDelete', async function () {
    const serviceCategory = await this.model.findOne<HydratedDocument<ServiceCategory>>(this.getQuery())

    if (!serviceCategory) return

    await cascadeDelete(serviceCategory)
  })

  ServiceCategorySchema.pre('deleteOne', async function () {
    const serviceCategory = await this.model.findOne<HydratedDocument<ServiceCategory>>(this.getQuery())

    if (!serviceCategory) return

    await cascadeDelete(serviceCategory)
  })

  return ServiceCategorySchema
}
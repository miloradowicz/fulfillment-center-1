import { Document, HydratedDocument, Model } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Product } from './product.schema'
import { Arrival } from './arrival.schema'
import { Order } from './order.schema'

export type ClientDocument = Client & Document

@Schema()
export class Client {
  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean

  @Prop({ required: true, unique: true }) name: string

  @Prop({ required: true }) phone_number: string

  @Prop({ required: true }) email: string

  @Prop({ required: true }) inn: string

  @Prop({ default: null }) address: string

  @Prop({ default: null }) banking_data: string

  @Prop({ default: null }) ogrn: string
}

const ClientSchema = SchemaFactory.createForClass(Client)

export const ClientSchemaFactory = (
  arrivalModel: Model<Arrival>,
  orderModel: Model<Order>,
  productModel: Model<Product>,
) => {
  const cascadeArchive = async (client: HydratedDocument<Client>) => {
    const arrivals = await arrivalModel.find({ client: client._id })
    const orders = await orderModel.find({ client: client._id })
    const products = await productModel.find({ client: client._id })

    await Promise.all([
      ...arrivals.map(x => x.updateOne({ isArchived: true })),
      ...orders.map(x => x.updateOne({ isArchived: true })),
      ...products.map(x => x.updateOne({ isArchived: true })),
    ])
  }

  const cascadeDelete = async (client: HydratedDocument<Client>) => {
    const arrivals = await arrivalModel.find({ client: client._id })
    const orders = await orderModel.find({ client: client._id })
    const products = await productModel.find({ client: client._id })

    await Promise.all([
      ...arrivals.map(x => x.deleteOne()),
      ...orders.map(x => x.deleteOne()),
      ...products.map(x => x.deleteOne()),
    ])
  }

  ClientSchema.post('findOneAndUpdate', async function () {
    const client = await this.model.findOne<HydratedDocument<Client>>(this.getQuery())

    if (!client) return

    const update = this.getUpdate()

    if (update && '$set' in update && update['$set'] && 'isArchived' in update['$set'] && update['$set'].isArchived) {
      await cascadeArchive(client)
    }
  })

  ClientSchema.post('updateOne', async function () {
    const client = await this.model.findOne<HydratedDocument<Client>>(this.getQuery())

    if (!client) return

    const update = this.getUpdate()

    if (update && '$set' in update && update['$set'] && 'isArchived' in update['$set'] && update['$set'].isArchived) {
      await cascadeArchive(client)
    }
  })

  ClientSchema.post('save', async function () {
    if (this.isModified('isArchived') && this.isArchived) {
      await cascadeArchive(this)
    }
  })

  ClientSchema.pre('findOneAndDelete', async function () {
    const client = await this.model.findOne<HydratedDocument<Client>>(this.getQuery())

    if (!client) return

    await cascadeDelete(client)
  })

  ClientSchema.pre('deleteOne', async function () {
    const client = await this.model.findOne<HydratedDocument<Client>>(this.getQuery())

    if (!client) return

    await cascadeDelete(client)
  })

  return ClientSchema
}



import { Document, HydratedDocument, Model } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import config from 'src/config'
import { JwtToken } from 'src/types'
import { Task } from './task.schema'
import { Arrival } from './arrival.schema'
import { Client } from './client.schema'
import { Product } from './product.schema'
import { Order } from './order.schema'
import { Counterparty } from './counterparty.schema'
import { Service } from './service.schema'
import { Stock } from './stock.schema'
import { RolesList, RolesType } from 'src/enums'

export interface UserDocument extends Document {
  isArchived: boolean;
  email: string;
  password: string;
  __confirmPassword: string;
  displayName: string;
  role: string;
  token: string;
  generateToken: () => void;
  clearToken: () => void;
  checkPassword: (password: string) => Promise<boolean>;
}

@Schema()
export class User {
  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean

  @Prop({
    required: true,
    unique: true,
  })
  email: string

  @Prop({
    required: true,
  })
  password: string

  @Prop({
    required: true,
  })
  displayName: string

  @Prop({ required: true, enum: RolesList })
  role: RolesType

  @Prop({
    required: false,
  })
  token: string
}

const UserSchema = SchemaFactory.createForClass(User)

UserSchema.methods.checkPassword = function (this: UserDocument, password: string) {
  return bcrypt.compare(password, this.password)
}

UserSchema.methods.generateToken = function (this: UserDocument) {
  this.token = jwt.sign({ id: this._id } as JwtToken, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
}

UserSchema.methods.clearToken = function (this: UserDocument) {
  this.token = jwt.sign({ id: this._id } as JwtToken, config.jwt.secret, { expiresIn: '0s' })
}

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(config.saltWorkFactor)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password
    return ret
  },
})

export const UserSchemaFactory = (
  clientModel: Model<Client>,
  productModel: Model<Product>,
  arrivalModel: Model<Arrival>,
  orderModel: Model<Order>,
  counterpartyModel: Model<Counterparty>,
  serviceModel: Model<Service>,
  stockModel: Model<Stock>,
  taskModel: Model<Task>
) => {
  const cascadeArchive = async (user: HydratedDocument<User>) => {
    const tasks = await taskModel.find({ user: user._id })

    await Promise.all(tasks.map(x => x.updateOne({ isArchived: true })))
  }

  const cascadeDelete = async (user: HydratedDocument<User>) => {
    await clientModel.updateMany({}, { $pull: { logs: { user: user._id } } }, { multi: true })
    await productModel.updateMany({}, { $pull: { logs: { user: user._id } } }, { multi: true })
    await arrivalModel.updateMany({}, { $pull: { logs: { user: user._id } } }, { multi: true })
    await orderModel.updateMany({}, { $pull: { logs: { user: user._id } } }, { multi: true })
    await counterpartyModel.updateMany({}, { $pull: { logs: { user: user._id } } }, { multi: true })
    await serviceModel.updateMany({}, { $pull: { logs: { user: user._id } } }, { multi: true })
    await stockModel.updateMany({}, { $pull: { logs: { user: user._id } } }, { multi: true })
    await taskModel.updateMany({}, { $pull: { logs: { user: user._id } } }, { multi: true })

    const tasks = await taskModel.find({ user: user._id })

    await Promise.all(tasks.map(x => x.deleteOne()))
  }

  UserSchema.pre('findOneAndUpdate', async function () {
    const user = await this.model.findOne<HydratedDocument<User>>(this.getQuery())

    if (!user) return

    const update = this.getUpdate()

    if (update && 'isArchived' in update && update.isArchived) {
      await cascadeArchive(user)
    }
  })

  UserSchema.pre('updateOne', async function () {
    const user = await this.model.findOne<HydratedDocument<User>>(this.getQuery())

    if (!user) return

    const update = this.getUpdate()

    if (update && 'isArchived' in update && update.isArchived) {
      await cascadeArchive(user)
    }
  })

  UserSchema.pre('save', async function () {
    if (this.isModified('isArchived') && this.isArchived) {
      await cascadeArchive(this)
    }
  })

  UserSchema.pre('findOneAndDelete', async function () {
    const user = await this.model.findOne<HydratedDocument<User>>(this.getQuery())

    if (!user) return

    await cascadeDelete(user)
  })

  UserSchema.pre('deleteOne', async function () {
    const user = await this.model.findOne<HydratedDocument<User>>(this.getQuery())

    if (!user) return

    await cascadeDelete(user)
  })

  return UserSchema
}

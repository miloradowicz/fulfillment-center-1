import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import config from '../config'
import { Arrival, ArrivalSchema } from '../schemas/arrival.schema'
import { Client, ClientSchema } from '../schemas/client.schema'
import { Product, ProductSchema } from '../schemas/product.schema'
import { Order, OrderSchema } from 'src/schemas/order.schema'
import { User, UserSchema } from '../schemas/user.schema'
import { Task, TaskSchema } from '../schemas/task.schema'

@Module({
  imports: [
    MongooseModule.forRoot(new URL(config.mongo.db, config.mongo.host).href),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MongooseModule.forFeature([{ name: Arrival.name, schema: ArrivalSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  exports: [MongooseModule],
})
export class DbModule {}

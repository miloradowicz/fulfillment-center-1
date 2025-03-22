import { Module } from '@nestjs/common'
import { getModelToken, MongooseModule } from '@nestjs/mongoose'
import config from '../config'
import { Arrival, ArrivalSchema } from '../schemas/arrival.schema'
import { Client, ClientSchemaFactory } from '../schemas/client.schema'
import { Product, ProductSchema } from '../schemas/product.schema'
import { Order, OrderSchema } from 'src/schemas/order.schema'
import { User, UserSchemaFactory } from '../schemas/user.schema'
import { Task, TaskSchema } from '../schemas/task.schema'
import { Service, ServiceSchema } from '../schemas/service.schema'
import { Stock, StockSchema } from '../schemas/stock.schema'
import { Counterparty, CounterpartySchema } from 'src/schemas/counterparty.schema'

@Module({
  imports: [
    MongooseModule.forRoot(new URL(config.mongo.db, config.mongo.host).href),
    MongooseModule.forFeatureAsync([
      {
        name: Client.name,
        useFactory: ClientSchemaFactory,
        imports: [DbModule],
        inject: [getModelToken(Arrival.name), getModelToken(Order.name), getModelToken(Product.name)],
      },
    ]),
    MongooseModule.forFeature([{ name: Arrival.name, schema: ArrivalSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: UserSchemaFactory,
        imports: [DbModule],
        inject: [
          getModelToken(Client.name),
          getModelToken(Product.name),
          getModelToken(Arrival.name),
          getModelToken(Order.name),
          getModelToken(Counterparty.name),
          getModelToken(Service.name),
          getModelToken(Stock.name),
          getModelToken(Task.name),
        ],
      },
    ]),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    MongooseModule.forFeature([{ name: Counterparty.name, schema: CounterpartySchema }]),
  ],
  exports: [MongooseModule],
})
export class DbModule {}

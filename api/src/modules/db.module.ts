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
import { Counter, CounterSchema } from '../schemas/counter.schema'
import { Counterparty, CounterpartySchema } from '../schemas/counterparty.schema'
import { ServiceCategory, ServiceCategorySchemaFactory } from '../schemas/service-category.schema'

@Module({
  imports: [
    MongooseModule.forRoot(new URL(config.mongo.db, config.mongo.host).href),
    MongooseModule.forFeature([
      { name: Arrival.name, schema: ArrivalSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Stock.name, schema: StockSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Counterparty.name, schema: CounterpartySchema },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Client.name,
        useFactory: ClientSchemaFactory,
        imports: [DbModule],
        inject: [getModelToken(Arrival.name), getModelToken(Order.name), getModelToken(Product.name)],
      },
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
      {
        name: ServiceCategory.name,
        useFactory: ServiceCategorySchemaFactory,
        imports: [DbModule],
        inject: [getModelToken(Service.name)],
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class DbModule {}

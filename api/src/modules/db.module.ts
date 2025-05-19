import { Module } from '@nestjs/common'
import { getModelToken, MongooseModule } from '@nestjs/mongoose'
import config from '../config'
import { Arrival, ArrivalSchemaFactory } from '../schemas/arrival.schema'
import { Client, ClientSchemaFactory } from '../schemas/client.schema'
import { Product, ProductSchema } from '../schemas/product.schema'
import { Order, OrderSchemaFactory } from 'src/schemas/order.schema'
import { User, UserSchemaFactory } from '../schemas/user.schema'
import { Task, TaskSchema } from '../schemas/task.schema'
import { Service, ServiceSchema } from '../schemas/service.schema'
import { Stock, StockSchema } from '../schemas/stock.schema'
import { Counter, CounterSchema } from '../schemas/counter.schema'
import { Counterparty, CounterpartySchema } from '../schemas/counterparty.schema'
import { ServiceCategory, ServiceCategorySchemaFactory } from '../schemas/service-category.schema'
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema'

@Module({
  imports: [
    MongooseModule.forRoot(
      config.mongo.host,
      {
        auth: { username: config.mongo.username, password: config.mongo.password },
        dbName: config.mongo.db,
      }
    ),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Stock.name, schema: StockSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Counterparty.name, schema: CounterpartySchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Client.name,
        useFactory: ClientSchemaFactory,
        imports: [DbModule],
        inject: [getModelToken(Arrival.name), getModelToken(Order.name), getModelToken(Product.name)],
      },
      {
        name: Arrival.name,
        useFactory: ArrivalSchemaFactory,
        imports: [DbModule],
        inject: [getModelToken(Task.name)],
      },
      {
        name: Order.name,
        useFactory: OrderSchemaFactory,
        imports: [DbModule],
        inject: [getModelToken(Task.name)],
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

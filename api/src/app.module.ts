import { Module } from '@nestjs/common'
import { DbModule } from './modules/db.module'
import { ClientsModule } from './modules/clients.module'
import { ProductsModule } from './modules/products.module'
import { ArrivalsModule } from './modules/arrivals.module'
import { OrdersModule } from './modules/orders.module'

@Module({
  imports: [DbModule, ClientsModule, ProductsModule, ArrivalsModule, OrdersModule],
})
export class AppModule {}

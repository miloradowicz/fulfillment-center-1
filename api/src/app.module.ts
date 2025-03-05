import { Module } from '@nestjs/common'
import { DbModule } from './modules/db.module'
import { ClientsModule } from './modules/clients.module'
import { ProductsModule } from './modules/products.module'
import { ArrivalsModule } from './modules/arrivals.module'
import { OrdersModule } from './modules/orders.module'
import { CsrfModule } from './modules/csrf.module'
import { UsersModule } from './modules/users.module'

@Module({
  imports: [CsrfModule, DbModule, ClientsModule, ProductsModule, ArrivalsModule, OrdersModule, UsersModule],
  controllers: [],
})
export class AppModule {}

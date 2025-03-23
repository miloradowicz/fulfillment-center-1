import { Module } from '@nestjs/common'
import { DbModule } from './modules/db.module'
import { ClientsModule } from './modules/clients.module'
import { ProductsModule } from './modules/products.module'
import { ArrivalsModule } from './modules/arrivals.module'
import { OrdersModule } from './modules/orders.module'
import { CsrfModule } from './modules/csrf.module'
import { UsersModule } from './modules/users.module'
import { LogsModule } from './modules/logs.module'
import { ValidatorsModule } from './modules/validators.module'
import { TasksModule } from './modules/tasks.module'
import { ServicesModule } from './modules/services.module'
import { StocksModule } from './modules/stocks.module'
import { AuthModule } from './modules/auth.module'
import { CounterpartiesModule } from './modules/counterparties.module'
import { ServiceCategoriesModule } from './modules/service-category.module'

@Module({
  imports: [
    CsrfModule,
    DbModule,
    AuthModule,
    ClientsModule,
    ProductsModule,
    ArrivalsModule,
    OrdersModule,
    TasksModule,
    UsersModule,
    LogsModule,
    ValidatorsModule,
    ServicesModule,
    StocksModule,
    CounterpartiesModule,
    ServiceCategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

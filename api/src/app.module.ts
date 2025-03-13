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
import { APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ServicesModule } from './modules/services.module'


@Module({
  imports: [CsrfModule, DbModule, ClientsModule, ProductsModule, ArrivalsModule, OrdersModule, TasksModule, UsersModule, LogsModule, ValidatorsModule, ServicesModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
  ] })
export class AppModule {}

import { Module } from '@nestjs/common'
import { OrdersController } from 'src/controllers/orders.controller'
import { OrdersService } from 'src/services/orders.service'
import { DbModule } from './db.module'
import { AuthModule } from './auth.module'
import { CounterService } from '../services/counter.service'

@Module({
  imports: [DbModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService, CounterService],
})
export class OrdersModule {}

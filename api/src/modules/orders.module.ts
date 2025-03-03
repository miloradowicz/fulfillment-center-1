import { Module } from '@nestjs/common'
import { OrdersController } from 'src/controllers/orders.controller'
import { OrdersService } from 'src/services/orders.service'
import { DbModule } from './db.module'

@Module({
  imports: [DbModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

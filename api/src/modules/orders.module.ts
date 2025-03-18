import { Module } from '@nestjs/common'
import { OrdersController } from 'src/controllers/orders.controller'
import { OrdersService } from 'src/services/orders.service'
import { DbModule } from './db.module'
import { AuthModule } from './auth.module'

@Module({
  imports: [DbModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

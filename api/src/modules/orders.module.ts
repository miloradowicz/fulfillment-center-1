import { Module } from '@nestjs/common'
import { OrdersController } from 'src/controllers/orders.controller'
import { OrdersService } from 'src/services/orders.service'
import { DbModule } from './db.module'
import { AuthModule } from './auth.module'
import { CounterService } from '../services/counter.service'
import { ValidatorsModule } from './validators.module'
import { FilesModule } from './file-upload.module'
import { StockManipulationService } from 'src/services/stock-manipulation.service'
import { LogsService } from '../services/logs.service'

@Module({
  imports: [DbModule, AuthModule, ValidatorsModule, FilesModule],
  controllers: [OrdersController],
  providers: [OrdersService, CounterService, StockManipulationService, LogsService],
})
export class OrdersModule { }


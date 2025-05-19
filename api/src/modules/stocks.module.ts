import { Module } from '@nestjs/common'
import { StocksController } from '../controllers/stocks.controller'
import { StocksService } from '../services/stocks.service'
import { DbModule } from './db.module'
import { ValidatorsModule } from './validators.module'
import { AuthModule } from './auth.module'
import { StockManipulationService } from 'src/services/stock-manipulation.service'
import { LogsService } from '../services/logs.service'

@Module({
  imports: [DbModule, AuthModule, ValidatorsModule],
  controllers: [StocksController],
  providers: [StocksService, StockManipulationService, LogsService],
})

export class StocksModule {}

import { Module } from '@nestjs/common'
import { StocksController } from '../controllers/stocks.controller'
import { StocksService } from '../services/stocks.service'
import { DbModule } from './db.module'
import { ValidatorsModule } from './validators.module'

@Module({
  imports: [DbModule, ValidatorsModule],
  controllers: [StocksController],
  providers: [StocksService],
})

export class StocksModule {}

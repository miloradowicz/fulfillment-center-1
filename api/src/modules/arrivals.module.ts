import { Module } from '@nestjs/common'
import { ArrivalsController } from 'src/controllers/arrivals.controller'
import { ArrivalsService } from 'src/services/arrivals.service'
import { DbModule } from './db.module'
import { ValidatorsModule } from './validators.module'
import { AuthModule } from './auth.module'
import { CounterService } from '../services/counter.service'
import { FilesModule } from './file-upload.module'
import { StockManipulationService } from 'src/services/stock-manipulation.service'
import { FilesService } from '../services/files.service'
import { LogsService } from '../services/logs.service'

@Module({
  imports: [DbModule, AuthModule, ValidatorsModule, FilesModule],
  controllers: [ArrivalsController],
  providers: [ArrivalsService, CounterService, StockManipulationService, FilesService, LogsService],
})
export class ArrivalsModule { }

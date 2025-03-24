import { Module } from '@nestjs/common'
import { ArrivalsController } from 'src/controllers/arrivals.controller'
import { ArrivalsService } from 'src/services/arrivals.service'
import { DbModule } from './db.module'
import { ValidatorsModule } from './validators.module'
import { AuthModule } from './auth.module'
import { CounterService } from '../services/counter.service'

@Module({
  imports: [DbModule, AuthModule, ValidatorsModule],
  controllers: [ArrivalsController],
  providers: [ArrivalsService, CounterService],
})
export class ArrivalsModule {}

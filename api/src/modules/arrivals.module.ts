import { Module } from '@nestjs/common'
import { ArrivalsController } from 'src/controllers/arrivals.controller'
import { ArrivalsService } from 'src/services/arrivals.service'
import { DbModule } from './db.module'
import { ValidatorsModule } from './validators.module'

@Module({
  imports: [DbModule, ValidatorsModule],
  controllers: [ArrivalsController],
  providers: [ArrivalsService],
})
export class ArrivalsModule {}

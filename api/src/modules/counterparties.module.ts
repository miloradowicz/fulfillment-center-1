import { Module } from '@nestjs/common'
import { DbModule } from './db.module'
import { ValidatorsModule } from './validators.module'
import { AuthModule } from './auth.module'
import { CounterpartiesService } from '../services/counterparties.service'
import { CounterpartiesController } from '../controllers/counterparties.controller'

@Module({
  imports: [DbModule, AuthModule, ValidatorsModule],
  controllers: [CounterpartiesController],
  providers: [CounterpartiesService],
})

export class CounterpartiesModule {}

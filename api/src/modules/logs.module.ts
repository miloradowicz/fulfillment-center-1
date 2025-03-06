import { Module } from '@nestjs/common'
import { LogsController } from 'src/controllers/logs.controller'
import { LogsService } from 'src/services/logs.service'
import { DbModule } from './db.module'

@Module({
  imports: [DbModule],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}

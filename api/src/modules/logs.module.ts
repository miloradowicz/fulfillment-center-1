import { Module } from '@nestjs/common'
import { LogsController } from 'src/controllers/logs.controller'
import { LogsService } from 'src/services/logs.service'
import { DbModule } from './db.module'
import { AuthModule } from './auth.module'

@Module({
  imports: [DbModule, AuthModule],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}

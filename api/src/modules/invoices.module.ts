import { Module } from '@nestjs/common'
import { InvoicesController } from 'src/controllers/invoices.controller'
import { InvoicesService } from 'src/services/invoices.service'
import { DbModule } from './db.module'
import { ValidatorsModule } from './validators.module'
import { AuthModule } from './auth.module'
import { CounterService } from '../services/counter.service'
import { FilesModule } from './file-upload.module'
import { LogsService } from '../services/logs.service'

@Module({
  imports: [DbModule, AuthModule, ValidatorsModule, FilesModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, CounterService, LogsService],
})
export class InvoicesModule {}

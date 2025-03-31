import { Module } from '@nestjs/common'
import { DbModule } from './db.module'
import { AuthModule } from './auth.module'
import { ReportsController } from '../controllers/reports.controller'
import { ReportService } from '../services/report.service'

@Module({
  imports: [DbModule, AuthModule],
  controllers: [ReportsController],
  providers: [ReportService],
})
export class ReportsModule{}

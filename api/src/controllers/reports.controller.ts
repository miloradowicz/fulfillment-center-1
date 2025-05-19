import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ReportService } from '../services/report.service'
import { Roles } from 'src/decorators/roles.decorator'
import { RolesGuard } from 'src/guards/roles.guard'

@UseGuards(RolesGuard)
@Roles('super-admin', 'admin')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async getReport(@Query('tab') tab: string, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format')
    }
    switch (tab) {
    case 'tasks':
      return this.reportService.getReportTaskForPeriod( start, end)
    case 'clients':
      return this.reportService.getReportClientForPeriod( start, end)
    default:
      throw new Error('Invalid tab value')
    }
  }
}

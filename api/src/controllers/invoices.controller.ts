import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CreateInvoiceDto } from '../dto/create-invoice.dto'
import { UpdateInvoiceDto } from '../dto/update-invoice.dto'
import { InvoicesService } from '../services/invoices.service'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'

@UseGuards(RolesGuard)
@Roles('super-admin', 'admin', 'manager')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async getAllInvoices() {
    return await this.invoicesService.getAll()
  }

  @Roles('super-admin')
  @Get('archived')
  async getArchivedInvoices() {
    return await this.invoicesService.getArchived()
  }

  @Get(':id')
  async getOneInvoice(@Param('id') id: string) {
    return this.invoicesService.getOne(id)
  }

  @Roles('super-admin')
  @Get('archived/:id')
  async getOneArchivedInvoice(@Param('id') id: string, @Query('populate') populate: string) {
    return this.invoicesService.getArchivedOne(id, populate === '1')
  }

  @Roles('super-admin', 'admin', 'manager')
  @Post()
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Put(':id')
  async updateInvoice(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return await this.invoicesService.update(id, updateInvoiceDto)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/archive')
  async archiveInvoice(@Param('id') id: string) {
    return await this.invoicesService.archive(id)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/unarchive')
  async unarchiveInvoice(@Param('id') id: string) {
    return this.invoicesService.unarchive(id)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteInvoice(@Param('id') id: string) {
    return this.invoicesService.delete(id)
  }
}

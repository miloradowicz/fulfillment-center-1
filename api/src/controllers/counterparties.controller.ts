import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common'
import { CounterpartiesService } from '../services/counterparties.service'
import { CreateCounterpartyDto } from '../dto/create-counterparty.dto'
import { UpdateCounterpartyDto } from '../dto/update-counterparty.dto'
import { Roles } from 'src/decorators/roles.decorator'
import { RolesGuard } from 'src/guards/roles.guard'

@UseGuards(RolesGuard)
@Roles('super-admin', 'admin', 'manager', 'stock-worker')
@Controller('counterparties')
export class CounterpartiesController {
  constructor(private readonly counterpartiesService: CounterpartiesService) {}

  @Get()
  async getAllCounterparties() {
    return this.counterpartiesService.getAll()
  }

  @Roles('super-admin')
  @Get('archived/all')
  async getAllArchivedCounterparties() {
    return this.counterpartiesService.getAllArchived()
  }

  @Get(':id')
  async getCounterpartyById(@Param('id') id: string) {
    return this.counterpartiesService.getById(id)
  }

  @Roles('super-admin')
  @Get('archived/:id')
  async getArchivedCounterparty(@Param('id') id: string) {
    return this.counterpartiesService.getArchivedById(id)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Post()
  async createCounterparty(@Body() counterpartyDto: CreateCounterpartyDto) {
    return this.counterpartiesService.create(counterpartyDto)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Put(':id')
  async updateCounterparty(@Param('id') id: string, @Body() counterpartyDto: UpdateCounterpartyDto) {
    return this.counterpartiesService.update(id, counterpartyDto)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/archive')
  async archiveCounterparty(@Param('id') id: string) {
    return this.counterpartiesService.archive(id)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/unarchive')
  async unarchiveClient(@Param('id') id: string) {
    return this.counterpartiesService.unarchive(id)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteCounterparty(@Param('id') id: string) {
    return this.counterpartiesService.delete(id)
  }
}

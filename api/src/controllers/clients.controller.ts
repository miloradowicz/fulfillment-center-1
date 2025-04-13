import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common'
import { ClientsService } from '../services/clients.service'
import { CreateClientDto } from '../dto/create-client.dto'
import { UpdateClientDto } from '../dto/update-client.dto'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'

@UseGuards(RolesGuard)
@Roles('super-admin', 'admin', 'manager', 'stock-worker')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async getAllClients() {
    return this.clientsService.getAll()
  }

  @Roles('super-admin')
  @Get('archived/all')
  async getAllArchivedClients() {
    return this.clientsService.getAllArchived()
  }

  @Get(':id')
  async getOneClient(@Param('id') id: string) {
    return this.clientsService.getById(id)
  }

  @Roles('super-admin')
  @Get('archived/:id')
  async getArchivedClient(@Param('id') id: string) {
    return this.clientsService.getArchivedById(id)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Post()
  async createClient(@Body() clientDto: CreateClientDto) {
    return this.clientsService.create(clientDto)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/archive')
  async archiveClient(@Param('id') id: string) {
    return this.clientsService.archive(id)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/unarchive')
  async unarchiveClient(@Param('id') id: string) {
    return this.clientsService.unarchive(id)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteClient(@Param('id') id: string) {
    return this.clientsService.delete(id)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Put(':id')
  async updateClient(@Param('id') id: string, @Body() clientDto: UpdateClientDto) {
    return this.clientsService.update(id, clientDto)
  }
}

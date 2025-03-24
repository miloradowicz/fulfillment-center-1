import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { ClientsService } from '../services/clients.service'
import { CreateClientDto } from '../dto/create-client.dto'
import { UpdateClientDto } from '../dto/update-client.dto'

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async getAllClients() {
    return this.clientsService.getAll()
  }

  @Get(':id')
  async getOneClient(@Param('id') id: string) {
    return this.clientsService.getById(id)
  }

  @Post()
  async createClient(@Body() clientDto: CreateClientDto) {
    return this.clientsService.create(clientDto)
  }

  @Patch(':id/archive')
  async archiveClient(@Param('id') id: string) {
    return this.clientsService.archive(id)
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: string) {
    return this.clientsService.delete(id)
  }

  @Put(':id')
  async updateClient(@Param('id') id: string, @Body() clientDto: UpdateClientDto) {
    return this.clientsService.update(id, clientDto)
  }
}

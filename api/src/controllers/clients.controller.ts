import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateClientDto } from '../dto/create-client.dto'
import { Client, ClientDocument } from '../schemas/client.schema'

@Controller('clients')
export class ClientsController {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument>,
  ) {}

  @Get()
  async getAllClients() {
    return this.clientModel.find()
  }

  @Get(':id')
  async getOneClient(@Param('id') id: string) {
    const client = await this.clientModel.findById(id)
    if (!client) {
      throw new NotFoundException('Клиент не найден')
    }
    return client
  }

  @Post()
  async createClient(@Body() clientDto: CreateClientDto) {
    const client = new this.clientModel(clientDto)
    return await client.save()
  }

  @Delete(':id')
  async deleteClient(@Param('_id') _id: string) {
    const client = await this.clientModel.findByIdAndDelete(_id)
    if (!client) {
      throw new NotFoundException('Клиент не найден')
    }
    return { message: 'Клиент успешно удален' }
  }

  @Put(':id')
  async updateClient(@Param('id') id: string, @Body() clientDto: CreateClientDto) {
    const existingClient = await this.clientModel.findById(id)

    if (!existingClient) {
      throw new NotFoundException('Клиент не найден!')
    }

    existingClient.name = clientDto.name || existingClient.name
    existingClient.phone_number = clientDto.phone_number || existingClient.phone_number
    existingClient.email = clientDto.email || existingClient.email
    existingClient.inn = clientDto.inn || existingClient.inn
    existingClient.address = clientDto.address || existingClient.address
    existingClient.banking_data = clientDto.banking_data || existingClient.banking_data
    existingClient.ogrn = clientDto.ogrn || existingClient.ogrn

    const updatedClient = await existingClient.save()
    return { message: 'Данные успешно изменены', updatedClient }
  }
}

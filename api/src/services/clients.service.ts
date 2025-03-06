import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Client, ClientDocument } from '../schemas/client.schema'
import { CreateClientDto } from '../dto/create-client.dto'
import { UpdateClientDto } from '../dto/update-client.dto'

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>) {}

  async getAll() {
    return this.clientModel.find()
  }

  async getById(id: string) {
    const client = await this.clientModel.findById(id)
    if (!client) throw new NotFoundException('Клиент не найден')
    return client
  }

  async create(clientDto: CreateClientDto) {
    const existingClient = await this.clientModel.findOne({ name: clientDto.name })

    if (existingClient) {
      throw new ConflictException('Клиент с таким именем уже существует')
    }

    return await this.clientModel.create(clientDto)
  }

  async update(id: string, clientDto: UpdateClientDto) {
    const client = await this.clientModel.findByIdAndUpdate(id, clientDto, { new: true })
    if (!client) {
      throw new NotFoundException('Клиент не найден')
    }
    return client
  }

  async delete(id: string) {
    const client = await this.clientModel.findByIdAndDelete(id)
    if (!client) throw new NotFoundException('Клиент не найден')
    return { message: 'Клиент успешно удалён' }
  }
}

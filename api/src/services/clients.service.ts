import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Client, ClientDocument } from '../schemas/client.schema'
import { CreateClientDto } from '../dto/create-client.dto'
import { UpdateClientDto } from '../dto/update-client.dto'

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>) {}

  async getAll() {
    return this.clientModel.find({ isArchived: false })
  }

  async getById(id: string) {
    const client = await this.clientModel.find({ isArchived: false }).findById(id)

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

  async archive(id: string) {
    const client = await this.clientModel.findByIdAndUpdate(id, { isArchived: true })

    if (!client) throw new NotFoundException('Клиент не найден')

    if (client.isArchived) throw new ForbiddenException('Клиент уже в архиве')

    return { message: 'Клиент перемещен в архив' }
  }

  async delete(id: string) {
    const client = await this.clientModel.findByIdAndDelete(id)
    if (!client) throw new NotFoundException('Клиент не найден')
    return { message: 'Клиент успешно удалён' }
  }
}

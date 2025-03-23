import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Client, ClientDocument } from '../schemas/client.schema'
import { CreateClientDto } from '../dto/create-client.dto'
import { UpdateClientDto } from '../dto/update-client.dto'
import { Arrival, ArrivalDocument } from 'src/schemas/arrival.schema'
import { ProductsService } from './products.service'
import { Product } from 'src/schemas/product.schema'

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ArrivalDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async getAll() {
    return this.clientModel.find({ isArchived: false })
  }

  async getById(id: string) {
    const client = await this.clientModel.findById(id)

    if (!client) throw new NotFoundException('Клиент не найден')

    if (client.isArchived) throw new ForbiddenException('Клиент в архиве')

    return client
  }

  async create(clientDto: CreateClientDto) {
    return await this.clientModel.create(clientDto)
  }

  async update(id: string, clientDto: UpdateClientDto) {
    const client = await this.clientModel.findById(id)

    if (!client) {
      throw new NotFoundException('Клиент не найден')
    }

    client.set(clientDto)
    await client.save()

    return client
  }

  async isLocked(id: string) {
    const client = await this.clientModel.findById(id)

    if (!client) throw new NotFoundException('Клиент не найден')

    const products = await this.productModel.find({ client: client._id })

    return await Promise.any(products.map(x => this.productsService.isLocked(String(x._id))))
  }

  async archive(id: string) {
    const client = await this.clientModel.findById(id)

    if (!client) throw new NotFoundException('Клиент не найден')

    if (client.isArchived) throw new ForbiddenException('Клиент уже в архиве')

    if (await this.isLocked(id))
      throw new ForbiddenException(
        'Клиент не может быть перемещен в архив, поскольку их товары уже используются в поставках и/или заказах.',
      )

    client.isArchived = true
    await client.save()

    return { message: 'Клиент перемещен в архив' }
  }

  async delete(id: string) {
    const client = await this.clientModel.findById(id)

    if (!client) throw new NotFoundException('Клиент не найден')

    const products = await this.productModel.find({ client: client._id })

    if (await Promise.any(products.map(x => this.productsService.isLocked(String(x._id)))))
      throw new ForbiddenException(
        'Клиент не может быть удален, поскольку их товары уже используются в поставках и/или заказах.',
      )

    await client.deleteOne()

    return { message: 'Клиент успешно удалён' }
  }
}

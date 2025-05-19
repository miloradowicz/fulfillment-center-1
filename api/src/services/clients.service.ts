import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Client, ClientDocument } from '../schemas/client.schema'
import { CreateClientDto } from '../dto/create-client.dto'
import { UpdateClientDto } from '../dto/update-client.dto'
import { Arrival, ArrivalDocument } from 'src/schemas/arrival.schema'
import { ProductsService } from './products.service'
import { Product } from 'src/schemas/product.schema'
import { Invoice } from '../schemas/invoice.schema'
import { Order, OrderDocument } from '../schemas/order.schema'

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ArrivalDocument>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<ArrivalDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async getAll() {
    const clients = await this.clientModel.find({ isArchived: false }).exec()
    return clients.reverse()
  }

  async getAllArchived() {
    const clients = await this.clientModel.find({ isArchived: true }).exec()
    return clients.reverse()
  }

  async getById(id: string) {
    const client = await this.clientModel.findById(id)

    if (!client) throw new NotFoundException('Клиент не найден')

    if (client.isArchived) throw new ForbiddenException('Клиент в архиве')

    return client
  }

  async getArchivedById(id: string) {
    const client = await this.clientModel.findById(id)

    if (!client) throw new NotFoundException('Клиент не найден')

    if (!client.isArchived) throw new ForbiddenException('Этот клиент не в архиве')

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

    if (!products.length) return false

    return await Promise.any(products.map(x => this.productsService.isLocked(String(x._id))))
  }

  async isLockedArchived(id: string) {
    const client = await this.clientModel.findById(id)
    if (!client) throw new NotFoundException('Клиент не найден')

    const products = await this.productModel.find({ client: client._id }, { _id: 1 })
    if (!products.length) return false

    const productIds = products.map(p => p._id)

    const hasActiveArrivals = await this.arrivalModel.exists({
      isArchived: { $ne: true },
      $or: [
        { products: { $elemMatch: { product: { $in: productIds } } } },
        { received_amount: { $elemMatch: { product: { $in: productIds } } } },
        { defects: { $elemMatch: { product: { $in: productIds } } } },
      ],
    })

    if (hasActiveArrivals) return true

    const hasActiveOrders = await this.orderModel.exists({
      isArchived: { $ne: true },
      products: { $elemMatch: { product: { $in: productIds } } },
    })

    return Boolean(hasActiveOrders)
  }

  async archive(id: string) {
    const client = await this.clientModel.findById(id)

    if (!client) throw new NotFoundException('Клиент не найден')

    if (client.isArchived) throw new ForbiddenException('Клиент уже в архиве')

    if (await this.isLockedArchived(id))
      throw new ForbiddenException(
        'Клиент не может быть перемещен в архив, поскольку его товары используются в неархивированных поставках и/или заказах.',
      )

    const hasUnpaidInvoices = await this.invoiceModel.exists({
      client: id,
      status: { $in: ['в ожидании', 'частично оплачено'] },
    })

    if (hasUnpaidInvoices) {
      throw new ForbiddenException(
        'Клиент не может быть перемещен в архив, так как у него есть неоплаченные счета.',
      )
    }
    client.isArchived = true
    await client.save()

    await Promise.all([
      this.productModel.updateMany({ client: id }, { isArchived: true }),
      this.orderModel.updateMany({ client: id }, { isArchived: true }),
      this.arrivalModel.updateMany({ client: id }, { isArchived: true }),
      this.invoiceModel.updateMany({ client: id }, { isArchived: true }),
    ])

    return { message: 'Клиент и все его товары, поставки, заказы и счета перемещены в архив' }
  }

  async unarchive(id: string) {
    const client = await this.clientModel.findById(id)

    if (!client) throw new NotFoundException('Клиент не найден')

    if (!client.isArchived) throw new ForbiddenException('Клиент не находится в архиве')


    client.isArchived = false
    await client.save()

    await Promise.all([
      this.productModel.updateMany({ client: id }, { isArchived: false }),
      this.orderModel.updateMany({ client: id }, { isArchived: false }),
      this.arrivalModel.updateMany({ client: id }, { isArchived: false }),
      this.invoiceModel.updateMany({ client: id }, { isArchived: false }),
    ])

    return { message: 'Клиент и все связанные сущности восстановлены из архива' }
  }

  async delete(id: string) {
    const client = await this.clientModel.findById(id)

    if (!client) throw new NotFoundException('Клиент не найден')

    if (await this.isLocked(id))
      throw new ForbiddenException(
        'Клиент не может быть удален, поскольку его товары используются в архивированных поставках и/или заказах.',
      )

    const hasUnpaidInvoices = await this.invoiceModel.exists({
      client: id,
      status: { $in: ['в ожидании', 'частично оплачено'] },
    })

    if (hasUnpaidInvoices) {
      throw new ForbiddenException(
        'Клиент не может быть удален, так как у него есть неоплаченные счета.',
      )
    }

    await Promise.all([
      this.productModel.deleteMany({ client: id }),
      this.orderModel.deleteMany({ client: id }),
      this.arrivalModel.deleteMany({ client: id }),
      this.invoiceModel.deleteMany({ client: id }),
    ])

    await client.deleteOne()

    return { message: 'Клиент и все связанные сущности успешно удалены' }
  }
}

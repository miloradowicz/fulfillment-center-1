import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order, OrderDocument } from '../schemas/order.schema'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'
import { CounterService } from './counter.service'
import { DocumentObject } from './arrivals.service'
import { FilesService } from './files.service'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private counterService: CounterService,
    private readonly filesService: FilesService,
  ) {}

  async getAll() {
    const orders = await this.orderModel.find({ isArchived: false }).exec()
    return orders.reverse()
  }

  async getAllArchived() {
    const orders = await this.orderModel.find({ isArchived: true }).exec()
    return orders.reverse()
  }

  async getAllWithClient() {
    const orders = await this.orderModel.find({ isArchived: false }).populate('client').exec()
    return orders.reverse()
  }

  async getById(id: string) {
    const order = await this.orderModel.findById(id).populate('products.product').exec()

    if (!order) throw new NotFoundException('Заказ не найден')

    if (order.isArchived) throw new ForbiddenException('Заказ в архиве')

    return order
  }

  async getByIdWithPopulate(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('client')
      .populate('products.product')
      .populate('defects.product')
      .exec()
    if (!order) throw new NotFoundException('Заказ не найден')

    if (order.isArchived) throw new ForbiddenException('Заказ в архиве')

    return order
  }

  async getArchivedById(id: string) {
    const order = await this.orderModel.findById(id).exec()

    if (!order) throw new NotFoundException('Заказ не найден')
    if (!order.isArchived) throw new ForbiddenException('Этот заказ не в архиве')

    return order
  }

  async create(orderDto: CreateOrderDto,files: Array<Express.Multer.File> = []) {
    try {
      let documents: DocumentObject[] = []
      if (files.length > 0) {
        documents = files.map(file => ({
          document: this.filesService.getFilePath(file.filename),
        }))
      }
      if (orderDto.documents) {
        if (typeof orderDto.documents === 'string') {
          try {
            orderDto.documents = JSON.parse(orderDto.documents) as DocumentObject[]
          } catch (_e) {
            orderDto.documents = []
          }
        }

        const formattedDocs = Array.isArray(orderDto.documents)
          ? orderDto.documents.map((doc: DocumentObject | string) =>
            typeof doc === 'string' ? { document: doc } : doc,
          )
          : []

        documents = [...formattedDocs, ...documents]
      }
      const newOrder = await this.orderModel.create({
        ...orderDto,
        documents,
      })

      const sequenceNumber = await this.counterService.getNextSequence('order')
      newOrder.orderNumber  = `ORD-${ sequenceNumber }`

      return newOrder.save()
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message)
      }
      throw new BadRequestException('Произошла ошибка при создании заказа')
    }
  }

  async update(id: string, orderDto: UpdateOrderDto, files: Array<Express.Multer.File> = []) {
    const existingOrder = await this.orderModel.findById(id)
    if (!existingOrder) {
      throw new NotFoundException('Заказ не найден')
    }
    if (files.length > 0) {
      const documentPaths = files.map(file => ({
        document: this.filesService.getFilePath(file.filename),
      }))
      orderDto.documents = [...(existingOrder.documents || []), ...documentPaths]
    }
    return this.orderModel.findByIdAndUpdate(id, orderDto, { new: true })
  }

  async archive(id: string) {
    const order = await this.orderModel.findByIdAndUpdate(id, { isArchived: true })

    if (!order) throw new NotFoundException('Заказ не найден')

    if (order.isArchived) throw new ForbiddenException('Заказ уже в архиве')

    return { message: 'Заказ перемещен в архив' }
  }

  async delete(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id)
    if (!order) throw new NotFoundException('Заказ не найден')
    return { message: 'Заказ успешно удалён' }
  }
}

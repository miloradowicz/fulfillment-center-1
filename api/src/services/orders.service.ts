import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order, OrderDocument } from '../schemas/order.schema'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {}

  async getAll() {
    return this.orderModel.find({ isArchived: false })
  }

  async getAllWithClient() {
    return this.orderModel.find({ isArchived: false }).populate('client').exec()
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

  async create(orderDto: CreateOrderDto) {
    return await this.orderModel.create(orderDto)
  }

  async update(id: string, orderDto: UpdateOrderDto) {
    const order = await this.orderModel.findByIdAndUpdate(id, orderDto, { new: true })
    if (!order) {
      throw new NotFoundException('Заказ не найден')
    }
    return order
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

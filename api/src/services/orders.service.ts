import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { Order, OrderDocument } from '../schemas/order.schema'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'
import { CounterService } from './counter.service'
import { DocumentObject } from './arrivals.service'
import { FilesService } from './files.service'
import { StockManipulationService } from './stock-manipulation.service'
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema'
import { LogsService } from './logs.service'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>,
    private readonly counterService: CounterService,
    private readonly filesService: FilesService,
    private readonly stockManipulationService: StockManipulationService,
    private readonly logsService: LogsService,
  ) {
  }

  async getAllByClient(clientId: string, populate: boolean) {
    const unarchived = this.orderModel.find({ isArchived: false }).populate('stock')

    if (populate) {
      return (await unarchived.find({ client: clientId }).populate('client')).reverse()
    }

    return (await unarchived.find({ client: clientId })).reverse()
  }

  async getAll(populate: boolean) {
    const unarchived = this.orderModel.find({ isArchived: false }).populate('stock')

    if (populate) {
      return (await unarchived.populate('client')).reverse()
    }

    return (await unarchived).reverse()
  }

  async getAllArchived() {
    const orders = await this.orderModel.find({ isArchived: true }).populate('client stock').exec()
    return orders.reverse()
  }

  async getAllWithClient() {
    const orders = await this.orderModel.find({ isArchived: false }).populate('client stock').exec()
    return orders.reverse()
  }

  async getById(id: string) {
    const order = await this.orderModel.findById(id).populate('products.product stock').exec()

    if (!order) throw new NotFoundException('Заказ не найден')

    if (order.isArchived) throw new ForbiddenException('Заказ в архиве')

    return order
  }

  async getByIdWithPopulate(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('client products.product defects.product stock invoice')
      .populate({
        path: 'services.service',
        populate: {
          path: 'serviceCategory',
          model: 'ServiceCategory',
        },
      })
      .lean()
      .exec()

    if (!order) throw new NotFoundException('Заказ не найден')
    if (order.isArchived) throw new ForbiddenException('Заказ в архиве')

    const invoice = await this.invoiceModel.findOne({ associatedOrder: order._id }).lean().exec()

    return {
      ...order,
      paymentStatus: invoice?.status ?? null,
    }
  }

  async getArchivedById(id: string) {
    const order = await this.orderModel.findById(id).populate('stock').exec()

    if (!order) throw new NotFoundException('Заказ не найден')
    if (!order.isArchived) throw new ForbiddenException('Этот заказ не в архиве')

    return order
  }

  async doStocking(order: OrderDocument) {
    if ((order.status === 'в пути' || order.status === 'доставлен') && order.products?.length) {
      await this.stockManipulationService.decreaseProductStock(order.stock, order.products)
    }

    if (order.status === 'доставлен' && order.defects?.length) {
      await this.stockManipulationService.increaseDefectStock(order.stock, order.defects)
    }
  }

  async undoStocking(order: OrderDocument) {
    if ((order.status === 'в пути' || order.status === 'доставлен') && order.products?.length) {
      await this.stockManipulationService.increaseProductStock(order.stock, order.products)
    }

    if (order.status === 'доставлен' && order.defects?.length) {
      await this.stockManipulationService.decreaseDefectStock(order.stock, order.defects)
    }
  }

  async create(orderDto: CreateOrderDto, files: Array<Express.Multer.File> = [], userId: mongoose.Types.ObjectId) {
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

      const sequenceNumber = await this.counterService.getNextSequence('order')

      const log = this.logsService.generateLogForCreate(userId)

      const newOrder = new this.orderModel({
        ...orderDto,
        documents,
        orderNumber: `ORD-${ sequenceNumber }`,
        logs: [log],
      })

      this.stockManipulationService.init()

      await this.doStocking(newOrder)

      if (!this.stockManipulationService.testStock(newOrder.stock)) {
        throw new BadRequestException('На данном складе нет необходимого количества товара')
      }

      await this.stockManipulationService.saveStock(newOrder.stock)
      await newOrder.save()
      return newOrder
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

  async update(id: string, orderDto: UpdateOrderDto, files: Array<Express.Multer.File> = [], userId: mongoose.Types.ObjectId) {
    const existingOrder = await this.orderModel.findById(id)
    if (!existingOrder) {
      throw new NotFoundException('Заказ не найден')
    }

    const orderDtoObj = { ...orderDto }
    if (!orderDto.defects) {
      orderDtoObj.defects = []
    }

    const log = this.logsService.trackChanges(
      existingOrder.toObject(),
      orderDtoObj,
      userId,
    )

    if (files.length > 0) {
      const documentPaths = files.map(file => ({
        document: this.filesService.getFilePath(file.filename),
      }))
      orderDto.documents = [...(existingOrder.documents || []), ...documentPaths]
    }

    this.stockManipulationService.init()

    const previousStock = existingOrder.stock
    await this.undoStocking(existingOrder)

    const updatedOrder = existingOrder.set({ ...new CreateOrderDto(), ...orderDto })
    const newStock = updatedOrder.stock
    await this.doStocking(updatedOrder)

    if (!this.stockManipulationService.testStock(newStock)) {
      throw new BadRequestException('На данном складе нет необходимого количества товара')
    }

    await this.stockManipulationService.saveStock(previousStock)
    await this.stockManipulationService.saveStock(newStock)

    if (log) {
      updatedOrder.logs.push(log)
    }

    await updatedOrder.save()
    return updatedOrder
  }

  async archive(id: string, userId: mongoose.Types.ObjectId) {
    const order = await this.orderModel.findById(id)

    if (!order) throw new NotFoundException('Заказ не найден')

    if (order.isArchived) throw new ForbiddenException('Заказ уже в архиве')

    if (order.status !== 'доставлен') {
      throw new ForbiddenException('Заказ можно архивировать только после доставки')
    }

    const hasUnpaidInvoice = await this.invoiceModel.exists({
      associatedOrder: id,
      status: { $in: ['в ожидании', 'частично оплачено'] },
    })

    if (hasUnpaidInvoice) {
      throw new ForbiddenException(
        'Заказ не может быть перемещен в архив, так как он не оплачен.',
      )
    }

    order.isArchived = true

    const log = this.logsService.generateLogForArchive(userId, order.isArchived)
    order.logs.push(log)

    await order.save()

    return { message: 'Заказ перемещен в архив' }
  }

  async unarchive(id: string, userId: mongoose.Types.ObjectId) {
    const order = await this.orderModel.findById(id)

    if (!order) throw new NotFoundException('Заказ не найден')

    if (!order.isArchived) throw new ForbiddenException('Заказ не находится в архиве')

    order.isArchived = false

    const log = this.logsService.generateLogForArchive(userId, order.isArchived)
    order.logs.push(log)

    await order.save()

    return { message: 'Заказ восстановлен из архива' }
  }

  async cancel(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id)
    if (!order) throw new NotFoundException('Заказ не найден')

    this.stockManipulationService.init()

    await this.undoStocking(order)

    await this.stockManipulationService.saveStock(order.stock)
    return { message: 'Заказ успешно отменен' }
  }

  async delete(id: string) {
    const order = await this.orderModel.findById(id)

    if (!order) throw new NotFoundException('Заказ не найден')


    if (order.status !== 'доставлен') {
      throw new ForbiddenException('Удалить можно только доставленный заказ')
    }

    const hasUnpaidInvoice = await this.invoiceModel.exists({
      associatedOrder: id,
      status: { $in: ['в ожидании', 'частично оплачено'] },
    })

    if (hasUnpaidInvoice) {
      throw new ForbiddenException(
        'Заказ не может быть удалён, так как он не оплачен.',
      )
    }
    await order.deleteOne()
    return { message: 'Заказ удалён' }
  }
}

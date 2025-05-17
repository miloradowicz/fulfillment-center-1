import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model, Types } from 'mongoose'
import { Stock, StockDocument } from '../schemas/stock.schema'
import { CreateStockDto } from '../dto/create-stock.dto'
import { UpdateStockDto } from '../dto/update-stock.dto'
import { CreateWriteOffDto } from 'src/dto/create-write-off.dto'
import { StockManipulationService } from './stock-manipulation.service'
import { WriteOff } from 'src/types'
import { LogsService } from './logs.service'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { Order, OrderDocument } from '../schemas/order.schema'

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private readonly stockModel: Model<StockDocument>,
    @InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly stockManipulationService: StockManipulationService,
    private readonly logsService: LogsService,
  ) {}

  async getAll() {
    return (await this.stockModel.find({ isArchived: false })).reverse()
  }

  async getAllArchived() {
    return this.stockModel.find({ isArchived: true }).exec()
  }

  async getOne(id: string) {
    const stock = await this.stockModel
      .findById(id)
      .populate({
        path: 'products.product defects.product write_offs.product',
        populate: { path: 'client' },
      })
      .populate({ path: 'logs.user', select: '-password -token' })
      .exec()

    if (!stock) throw new NotFoundException('Склад не найден.')

    if (stock.isArchived) throw new ForbiddenException('Склад в архиве.')

    return stock
  }

  async getArchivedById(id: string) {
    const stock = await this.stockModel.findById(id).exec()

    if (!stock) throw new NotFoundException('Склад не найден.')

    if (!stock.isArchived) throw new ForbiddenException('Этот склад не в архиве.')

    return stock
  }

  async create(stockDto: CreateStockDto, userId: mongoose.Types.ObjectId) {
    const log = this.logsService.generateLogForCreate(userId)

    const stockToCreate = {
      ...stockDto,
      logs: [log],
    }

    return await this.stockModel.create(stockToCreate)
  }

  async update(id: string, stockDto: UpdateStockDto, userId: mongoose.Types.ObjectId) {
    const stock = await this.stockModel.findById(id)
    if (!stock) throw new NotFoundException('Склад не найден.')

    const stockDtoObj = { ...stockDto }
    const log = this.logsService.trackChanges(
      stock.toObject(),
      stockDtoObj,
      userId,
    )

    stock.set(stockDto)
    if (log) {
      stock.logs.push(log)
    }
    return await stock.save()
  }

  async doStocking(stockId: Types.ObjectId, writeOffs: WriteOff[]) {
    if (writeOffs?.length) {
      await this.stockManipulationService.decreaseProductStock(stockId, writeOffs)
    }
  }

  async undoStocking(stockId: Types.ObjectId, writeOffs: WriteOff[]) {
    if (writeOffs?.length) {
      await this.stockManipulationService.increaseProductStock(stockId, writeOffs)
    }
  }

  async createWriteOff(id: string, writeOffDto: CreateWriteOffDto, userId: mongoose.Types.ObjectId) {
    const stock = await this.stockModel.findById(id)
    if (!stock) throw new NotFoundException('Склад не найден.')

    this.stockManipulationService.init()

    await this.doStocking(stock._id, writeOffDto.write_offs)

    await this.stockManipulationService.saveStock(stock._id)

    const newStock = { ...stock.toObject() }
    newStock.write_offs.push(...writeOffDto.write_offs)

    const log = this.logsService.trackChanges(
      stock.toObject(),
      newStock,
      userId,
    )
    stock.write_offs.push(...writeOffDto.write_offs)

    if (log) {
      stock.logs.push(log)
    }

    await stock.save()

    return writeOffDto
  }

  async isLockedForArchive(id: string): Promise<boolean> {
    const stock = await this.stockModel.findById(id)
    if (!stock) throw new NotFoundException('Склад не найден')

    const activeArrivals = await this.arrivalModel.find({
      stock: stock._id,
      $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
    })

    if (activeArrivals.length > 0) return true

    const activeOrders = await this.orderModel.find({
      stock: stock._id,
      $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
    })

    return activeOrders.length > 0
  }

  async archive(id: string, userId: mongoose.Types.ObjectId) {
    const stock = await this.stockModel.findById(id).exec()

    if (!stock) throw new NotFoundException('Склад не найден.')

    if (stock.isArchived) throw new ForbiddenException('Склад уже в архиве.')

    const hasActiveProducts = stock.products.some(p => p.amount > 0)

    if (hasActiveProducts) {
      throw new ForbiddenException('На складе ещё есть товары. Архивация невозможна.')
    }
    const isLockedForArchive = await this.isLockedForArchive(id)
    if (isLockedForArchive) {
      throw new ForbiddenException('Склад участвует в неархивированных поставках или заказах. Архивация невозможна.')
    }

    stock.isArchived = true
    const log = this.logsService.generateLogForArchive(userId, stock.isArchived)
    stock.logs.push(log)

    await stock.save()
    return { message: 'Склад перемещен в архив.' }
  }

  async unarchive(id: string, userId: mongoose.Types.ObjectId) {
    const stock = await this.stockModel.findById(id)

    if (!stock) throw new NotFoundException('Склад не найден')

    if (!stock.isArchived) throw new ForbiddenException('Склад не находится в архиве')

    stock.isArchived = false
    const log = this.logsService.generateLogForArchive(userId, stock.isArchived)
    stock.logs.push(log)

    await stock.save()

    return { message: 'Склад восстановлен из архива' }
  }

  async isLocked(id: string) {
    const stock = await this.stockModel.findById(id)
    if (!stock) throw new NotFoundException('Склад не найден')
    const arrivals = await this.arrivalModel.find({
      stock: stock._id,
    })
    if (arrivals.length) return true
    const orders = await this.orderModel.find({
      stock: stock._id,
    })
    return !!orders.length
  }

  async delete(id: string) {
    const stock = await this.stockModel.findById(id).exec()
    if (!stock) throw new NotFoundException('Склад не найден.')

    const hasActiveProducts = stock.products.some(p => p.amount > 0)
    if (hasActiveProducts) {
      throw new ForbiddenException('На складе есть товары. Удаление невозможно.')
    }

    const isLocked = await this.isLocked(id)
    if (isLocked) {
      throw new ForbiddenException('Склад участвует в архивироавнных поставках или заказах. Удаление невозможно.')
    }

    await this.stockModel.findByIdAndDelete(id)
    return { message: 'Склад успешно удален.' }
  }
}

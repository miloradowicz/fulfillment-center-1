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

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private readonly stockModel: Model<StockDocument>,
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
        path: 'products.product defects.product',
        populate: { path: 'client' },
      })
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

  async archive(id: string, userId: mongoose.Types.ObjectId) {
    const stock = await this.stockModel.findById(id)

    if (!stock) throw new NotFoundException('Склад не найден.')

    if (stock.isArchived) throw new ForbiddenException('Склад уже в архиве.')
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

  async delete(id: string) {
    const stock = await this.stockModel.findByIdAndDelete(id)
    if (!stock) throw new NotFoundException('Склад не найден.')
    return { message: 'Склад успешно удален.' }
  }
}

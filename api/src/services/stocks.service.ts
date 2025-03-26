import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Stock, StockDocument } from '../schemas/stock.schema'
import { CreateStockDto } from '../dto/create-stock.dto'
import { UpdateStockDto } from '../dto/update-stock.dto'

@Injectable()
export class StocksService {
  constructor(@InjectModel(Stock.name) private readonly stockModel: Model<StockDocument>) {}

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
        path: 'products.product',
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

  async create(stockDto: CreateStockDto) {
    return await this.stockModel.create(stockDto)
  }

  async update(id: string, stockDto: UpdateStockDto) {
    const stock = await this.stockModel.findByIdAndUpdate(id, stockDto, { new: true })
    if (!stock) throw new NotFoundException('Склад не найден.')
    return stock
  }

  async archive(id: string) {
    const stock = await this.stockModel.findByIdAndUpdate(id, { isArchived: true })

    if (!stock) throw new NotFoundException('Склад не найден.')

    if (stock.isArchived) throw new ForbiddenException('Склад уже в архиве.')

    return { message: 'Склад перемещен в архив.' }
  }

  async delete(id: string) {
    const stock = await this.stockModel.findByIdAndDelete(id)
    if (!stock) throw new NotFoundException('Склад не найден.')
    return { message: 'Склад успешно удален.' }
  }
}

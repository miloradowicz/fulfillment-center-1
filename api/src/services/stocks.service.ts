import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Stock, StockDocument } from '../schemas/stock.schema'
import { CreateStockDto } from '../dto/create-stock.dto'
import { UpdateStockDto } from '../dto/update-stock.dto'

@Injectable()
export class StocksService {
  constructor(@InjectModel(Stock.name) private readonly stockModel: Model<StockDocument>) {}

  async getAll() {
    return (await this.stockModel.find()).reverse()
  }

  async getOne(id: string) {
    const stock = await this.stockModel.findById(id)
    if (!stock) throw new NotFoundException('Склад не найден.')
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

  async delete(id: string) {
    const stock = await this.stockModel.findByIdAndDelete(id)
    if (!stock) throw new NotFoundException('Склад не найден.')
    return { message: 'Склад успешно удален.' }
  }
}

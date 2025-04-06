import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, Model } from 'mongoose'
import { Stock } from 'src/schemas/stock.schema'

type ObjectId = mongoose.Types.ObjectId

interface ProductWithAmount {
  product: ObjectId;
  amount: number;
}

@Injectable()
export class StockManipulationService<T extends ProductWithAmount = ProductWithAmount> {
  private stocks: {
    [key: string]: HydratedDocument<Stock>
  } = {}

  constructor(@InjectModel(Stock.name) private readonly stockModel: Model<Stock>) {}

  async increaseProductStock(stockId: ObjectId, products: T[]) {
    let stock: HydratedDocument<Stock>

    if (String(stockId) in this.stocks) {
      stock = this.stocks[String(stockId)]
    } else {
      const _stock = await this.stockModel.findById(stockId)
      if (!_stock) throw new NotFoundException('Указанный склад не найден')
      stock = _stock
      this.stocks = { ...this.stocks, [String(stockId)]: stock }
    }

    for (const product of products) {
      const existingProduct = stock.products.find(p => p.product.equals(product.product))

      if (existingProduct) {
        existingProduct.amount += product.amount
      } else {
        stock.products.push({
          product: product.product,
          amount: product.amount,
        } as T)
      }
    }
  }

  async decreaseProductStock(stockId: ObjectId, products: T[]) {
    let stock: HydratedDocument<Stock>

    if (String(stockId) in this.stocks) {
      stock = this.stocks[String(stockId)]
    } else {
      const _stock = await this.stockModel.findById(stockId)
      if (!_stock) throw new NotFoundException('Указанный склад не найден')
      stock = _stock
      this.stocks = { ...this.stocks, [String(stockId)]: stock }
    }

    for (const product of products) {
      const existingProduct = stock.products.find(p => p.product.equals(product.product))
      if (existingProduct) {
        existingProduct.amount -= product.amount
      } else {
        stock.products.push({
          product: product.product,
          amount: -product.amount,
        } as T)
      }
    }
  }

  init() {
    this.stocks = {}
  }

  testStock(stockId: ObjectId) {
    if (String(stockId) in this.stocks) {
      return this.stocks[String(stockId)].products.every(x => x.amount >= 0)
    } else
    {
      return true
    }
  }

  async saveStock(stockId: ObjectId) {
    if (String(stockId) in this.stocks) {
      const stock = this.stocks[String(stockId)]

      stock.products = stock.products.filter(x => x.amount > 0)

      await stock.save()
    }
  }
}

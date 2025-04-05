import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { Stock } from 'src/schemas/stock.schema'

type ObjectId = mongoose.Types.ObjectId

interface ProductWithAmount {
  product: ObjectId;
  amount: number;
}

@Injectable()
export class StockManipulationService<T extends ProductWithAmount = ProductWithAmount> {
  constructor(
    @InjectModel(Stock.name) private readonly stockModel: Model<Stock>,
  ) { }

  async increaseProductStock(stockId: ObjectId, products: T[]) {
    const stock = await this.stockModel.findById(stockId)
    if (!stock) throw new NotFoundException('Указанный склад не найден')

    for (const product of products) {
      const existingProduct = stock.products.find(
        p => p.product.equals(product.product)
      )

      if (existingProduct) {
        existingProduct.amount += product.amount
      } else {
        stock.products.push({
          product: product.product,
          amount: product.amount,
        } as T)
      }
    }

    await stock.save()
  }

  async decreaseProductStock(stockId: ObjectId, products: T[]) {
    const stock = await this.stockModel.findById(stockId)
    if (!stock) throw new NotFoundException('Указанный склад не найден')

    for (const product of products) {
      const stockProductIndex = stock.products.findIndex(
        p => p.product.equals(product.product)
      )
      if (stockProductIndex === -1) continue

      const stockProduct = stock.products[stockProductIndex]

      stockProduct.amount -= product.amount

      if (stockProduct.amount <= 0) {
        stock.products.splice(stockProductIndex, 1)
      }
    }

    await stock.save()
  }
}

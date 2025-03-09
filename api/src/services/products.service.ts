import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateProductDto } from '../dto/create-product.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { Product, ProductDocument } from '../schemas/product.schema'

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  async getById(id: string) {
    const product = await this.productModel.findById(id)

    if (!product) {
      throw new NotFoundException('Товар не найден')
    }

    return product
  }

  async getAllByClient(clientId: string, populate:boolean)  {
    if (populate) {
      return (await this.productModel.find({ client: clientId }).populate('client')).reverse()
    }
    else{ return (await this.productModel.find({ client: clientId })).reverse()}
  }

  async getAll(populate:boolean) {
    if (populate) {
      return (await this.productModel.find().populate('client')).reverse()
    }
    return (await this.productModel.find()).reverse()
  }

  async create(productDto: CreateProductDto) {
    const product = await this.productModel.create(productDto)

    return product
  }

  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id)

    if (!product) {
      throw new NotFoundException('Товар не найден')
    }

    return { message: 'Товар успешно удален' }
  }

  async update(id: string, productDto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(id, productDto)

    if (!product) {
      throw new NotFoundException('Товар не найден')
    }

    return product
  }
}

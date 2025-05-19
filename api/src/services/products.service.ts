import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { CreateProductDto } from '../dto/create-product.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { Product, ProductDocument } from '../schemas/product.schema'
import { Arrival, ArrivalDocument } from 'src/schemas/arrival.schema'
import { Order, OrderDocument } from 'src/schemas/order.schema'
import { LogsService } from './logs.service'

interface DynamicFieldDto {
  key: string;
  label: string;
  value: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly logsService: LogsService,
  ) {}

  async getById(id: string, populate?: boolean) {
    let product: ProductDocument | null

    if (populate) {
      product = await this.productModel.findById(id).populate('client').populate({ path: 'logs.user', select: '-password -token' }).exec()
    } else {
      product = await this.productModel.findById(id).exec()
    }

    if (!product) throw new NotFoundException('Товар не найден')

    if (product.isArchived) throw new ForbiddenException('Товар в архиве')

    return product
  }

  async getAllByClient(clientId: string, populate: boolean) {
    const unarchived = this.productModel.find({ isArchived: false })

    if (populate) {
      return (await unarchived.find({ client: clientId }).populate('client')).reverse()
    }

    return (await unarchived.find({ client: clientId })).reverse()
  }

  async getAll(populate: boolean) {
    const unarchived = this.productModel.find({ isArchived: false })

    if (populate) {
      return (await unarchived.populate('client')).reverse()
    }

    return (await unarchived).reverse()
  }

  async getAllArchived(populate: boolean) {
    const query = this.productModel.find({ isArchived: true })

    if (populate) {
      query.populate({
        path: 'client',
        select: 'name',
      })
    }

    return (await query.exec()).reverse()
  }

  async getArchivedById(id: string, populate?: boolean) {
    let product: ProductDocument | null

    if (populate) {
      product = await this.productModel.findById(id).populate('client').exec()
    } else {
      product = await this.productModel.findById(id).exec()
    }

    if (!product) throw new NotFoundException('Товар не найден')

    if (!product.isArchived) throw new ForbiddenException('Этот товар не в архиве')

    return product
  }

  async create(productDto: CreateProductDto, userId: mongoose.Types.ObjectId) {

    const barcode = await this.productModel.findOne({ barcode: productDto.barcode })
    if (barcode) {
      throw new BadRequestException({
        errors: {
          barcode: {
            messages: ['Продукт с таким штрихкодом уже существует'],
          },
        },
      })
    }

    const article = await this.productModel.findOne({ article: productDto.article })
    if (article) {
      throw new BadRequestException({
        errors: {
          article: {
            messages: ['Продукт с таким артикулом уже существует'],
          },
        },
      })
    }

    try {
      if (productDto.dynamic_fields && typeof productDto.dynamic_fields === 'string') {
        try {
          productDto.dynamic_fields = JSON.parse(productDto.dynamic_fields) as DynamicFieldDto[]
        } catch (_e) {
          throw new BadRequestException('Неверный формат dynamic_fields')
        }
      }

      const log = this.logsService.generateLogForCreate(userId)

      const productToCreate = {
        ...productDto,
        logs: [log],
      }

      return await this.productModel.create(productToCreate)
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message)
      }
      throw new BadRequestException('Произошла ошибка при создании продукта')
    }
  }

  async isLocked(id: string) {
    const product = await this.productModel.findById(id)

    if (!product) throw new NotFoundException('Товар не найден')

    const arrivals = await this.arrivalModel.find({
      $or: [
        { products: { $elemMatch: { product: product._id } } },
        { received_amount: { $elemMatch: { product: product._id } } },
        { defects: { $elemMatch: { product: product._id } } },
      ],
    })

    if (arrivals.length) return true

    const orders = await this.orderModel.find({
      $or: [{ products: { $elemMatch: { product: product._id } } }],
    })

    return !!orders.length

  }

  async archive(id: string, userId: mongoose.Types.ObjectId) {
    if (await this.isLocked(id))
      throw new ForbiddenException('Товар не может быть перемещен в архив, поскольку уже используется в поставках и/или заказах.')

    const product = await this.productModel.findById(id)

    if (!product) throw new NotFoundException('Товар не найден')

    if (product.isArchived) throw new ForbiddenException('Товар уже в архиве')

    product.isArchived = true
    const log = this.logsService.generateLogForArchive(userId, product.isArchived)

    product.logs.push(log)
    await product.save()

    return { message: 'Товар перемещен в архив' }
  }

  async unarchive(id: string, userId: mongoose.Types.ObjectId) {
    const product = await this.productModel.findById(id)

    if (!product) throw new NotFoundException('Продукт не найден')

    if (!product.isArchived) throw new ForbiddenException('Продукт не находится в архиве')

    product.isArchived = false
    const log = this.logsService.generateLogForArchive(userId, product.isArchived)

    product.logs.push(log)
    await product.save()

    return { message: 'Продукт восстановлен из архива' }
  }

  async delete(id: string) {
    if (await this.isLocked(id))
      throw new ForbiddenException('Товар не может быть удален, поскольку уже используется в поставках и/или заказах.')

    try {
      const deletedProduct = await this.productModel.findByIdAndDelete(id)

      if (!deletedProduct) {
        throw new NotFoundException('Товар не найден')
      }

      return { message: 'Товар успешно удален' }
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new BadRequestException(`Ошибка при удалении продукта: ${ errorMessage }`)
    }
  }

  async update(id: string, productDto: UpdateProductDto, userId: mongoose.Types.ObjectId) {
    const existingProduct = await this.productModel.findById(id)
    if (!existingProduct){
      throw new NotFoundException('Товар не найден')
    }

    const productDtoObj = { ...productDto }

    const log = this.logsService.trackChanges(
      existingProduct.toObject(),
      productDtoObj,
      userId,
    )

    if (productDto.barcode !== existingProduct.barcode) {
      const barcodeExists = await this.productModel.findOne({ barcode: productDto.barcode })
      if (barcodeExists) {
        throw new BadRequestException({
          errors: {
            barcode: { messages: ['Продукт с таким штрихкодом уже существует'] },
          },
        })
      }
    }

    if (productDto.article !== existingProduct.article) {
      const articleExists = await this.productModel.findOne({ article: productDto.article })
      if (articleExists) {
        throw new BadRequestException({
          errors: {
            article: { messages: ['Продукт с таким артикулом уже существует'] },
          },
        })
      }
    }

    try {
      if (productDto.dynamic_fields && typeof productDto.dynamic_fields === 'string') {
        try {
          productDto.dynamic_fields = JSON.parse(productDto.dynamic_fields) as DynamicFieldDto[]
        } catch (_e) {
          throw new BadRequestException('Неверный формат dynamic_fields')
        }
      }

      existingProduct.set(productDto)

      if (log) {
        existingProduct.logs.push(log)
      }

      await existingProduct.save()
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new BadRequestException(`Ошибка при обновлении продукта: ${ errorMessage }`)
    }
  }
}

import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateProductDto } from '../dto/create-product.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { Product, ProductDocument } from '../schemas/product.schema'
import { FilesService } from './files.service'
import { Arrival, ArrivalDocument } from 'src/schemas/arrival.schema'
import { Order, OrderDocument } from 'src/schemas/order.schema'

interface DocumentObject {
  document: string;
}

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
    private readonly filesService: FilesService,
  ) {}

  async getById(id: string, populate?: boolean) {
    let product: ProductDocument | null

    if (populate) {
      product = await this.productModel.findById(id).populate('client').exec()
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

  async create(productDto: CreateProductDto, files: Array<Express.Multer.File> = []) {

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

      if (files && files.length > 0) {
        const documentPaths = files.map(file => ({
          document: this.filesService.getFilePath(file.filename),
        }))

        productDto.documents = productDto.documents || []
        if (typeof productDto.documents === 'string') {
          try {
            productDto.documents = JSON.parse(productDto.documents) as DocumentObject[]
          } catch (_e) {
            productDto.documents = []
          }
        }

        const formattedDocs = Array.isArray(productDto.documents)
          ? productDto.documents.map((doc: DocumentObject | string) =>
            typeof doc === 'string' ? { document: doc } : doc,
          )
          : []

        productDto.documents = [...formattedDocs, ...documentPaths]
      }

      return await this.productModel.create(productDto)
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

    if (orders.length) return true

    return false
  }

  async archive(id: string) {
    if (await this.isLocked(id))
      throw new ForbiddenException('Товар не может быть перемещен в архив, поскольку уже используется в поставках и/или заказах.')

    const product = await this.productModel.findByIdAndUpdate(id, { isArchived: true })

    if (!product) throw new NotFoundException('Товар не найден')

    if (product.isArchived) throw new ForbiddenException('Товар уже в архиве')

    return { message: 'Товар перемещен в архив' }
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

  async update(id: string, productDto: UpdateProductDto, files: Array<Express.Multer.File> = []) {
    const existingProduct = await this.getById(id)
    if (!existingProduct){
      throw new NotFoundException('Товар не найден')
    }

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

      if (files && files.length > 0) {
        const documentPaths = files.map(file => ({
          document: this.filesService.getFilePath(file.filename),
        }))

        const existingDocs = existingProduct.documents || []
        productDto.documents = [...existingDocs, ...documentPaths]
      }

      return this.productModel.findByIdAndUpdate(
        id,
        productDto,
        { new: true }
      )
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new BadRequestException(`Ошибка при обновлении продукта: ${ errorMessage }`)
    }
  }
}

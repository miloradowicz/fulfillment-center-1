import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateProductDto } from '../dto/create-product.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { Product, ProductDocument } from '../schemas/product.schema'
import { FilesService } from './files.service'

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
    private readonly filesService: FilesService
  ) {}

  async getById(id: string) {
    const product = await this.productModel.findById(id)

    if (!product) {
      throw new NotFoundException('Товар не найден')
    }

    return product
  }

  async getAllByClient(clientId: string, populate: boolean) {
    if (populate) {
      return (await this.productModel.find({ client: clientId }).populate('client')).reverse()
    } else {
      return (await this.productModel.find({ client: clientId })).reverse()
    }
  }

  async getAll(populate: boolean) {
    if (populate) {
      return (await this.productModel.find().populate('client')).reverse()
    }
    return (await this.productModel.find()).reverse()
  }

  async create(productDto: CreateProductDto, files: Array<Express.Multer.File> = []) {
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
            typeof doc === 'string' ? { document: doc } : doc)
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

  async delete(id: string) {
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
    try {
      const existingProduct = await this.getById(id)

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

      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        productDto,
        { new: true }
      )

      if (!updatedProduct) {
        throw new NotFoundException('Товар не найден')
      }

      return updatedProduct
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new BadRequestException(`Ошибка при обновлении продукта: ${ errorMessage }`)
    }
  }
}

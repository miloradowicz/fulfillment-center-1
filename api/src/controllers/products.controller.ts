import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, UploadedFiles, Query, Patch } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { CreateProductDto } from '../dto/create-product.dto'
import { ProductsService } from '../services/products.service'
import { UpdateProductDto } from '../dto/update-product.dto'
import { diskStorage } from 'multer'
import * as path from 'node:path'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('documents', 10, {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (_req, file, cb) => {
          const originalExt = path.extname(file.originalname) || ''
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          cb(null, `${ file.fieldname }-${ uniqueSuffix }${ originalExt }`)
        },
      }),
    })
  )
  async createProduct(
    @Body() productDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return await this.productsService.create(productDto, files)
  }


  @Get()
  async getAllProducts(
    @Query('client') clientId: string,
    @Query('populate') populate?: string
  ) {
    if (clientId) {
      return await this.productsService.getAllByClient(clientId, populate === '1')
    } else {
      return await this.productsService.getAll(populate === '1')
    }
  }

  @Get(':id')
  async getProduct(
    @Param('id') id: string,
    @Query('populate') populate?: string
  ) {
    return await this.productsService.getById(id, populate === '1')
  }

  @Patch(':id/archive')
  async archiveProduct(@Param('id') id: string) {
    return await this.productsService.archive(id)
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.delete(id)
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('documents', 10, { dest: './uploads/documents' }))
  async updateProduct(
    @Param('id') id: string,
    @Body() productDto: UpdateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return await this.productsService.update(id, productDto, files)
  }
}

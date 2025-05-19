import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { CreateProductDto } from '../dto/create-product.dto'
import { ProductsService } from '../services/products.service'
import { UpdateProductDto } from '../dto/update-product.dto'
import { Roles } from 'src/decorators/roles.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { RequestWithUser } from '../types'

@UseGuards(RolesGuard)
@Roles('stock-worker', 'manager', 'admin', 'super-admin')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles('super-admin', 'admin', 'manager')
  @Post()
  async createProduct(@Body() productDto: CreateProductDto, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return await this.productsService.create(productDto, userId)
  }

  @Get()
  async getAllProducts(@Query('client') clientId: string, @Query('populate') populate?: string) {
    if (clientId) {
      return await this.productsService.getAllByClient(clientId, populate === '1')
    } else {
      return await this.productsService.getAll(populate === '1')
    }
  }

  @Roles('super-admin')
  @Get('archived/all')
  async getAllArchivedProducts(@Query('populate') populate?: string) {
    return await this.productsService.getAllArchived(populate === '1')
  }

  @Get(':id')
  async getProduct(@Param('id') id: string, @Query('populate') populate?: string) {
    return await this.productsService.getById(id, populate === '1')
  }

  @Roles('super-admin')
  @Get('archived/:id')
  async getArchivedProduct(@Param('id') id: string, @Query('populate') populate?: string) {
    return await this.productsService.getArchivedById(id, populate === '1')
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/archive')
  async archiveProduct(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return await this.productsService.archive(id, userId)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/unarchive')
  async unarchiveProduct(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.productsService.unarchive(id, userId)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.delete(id)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() productDto: UpdateProductDto, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return await this.productsService.update(id, productDto, userId)
  }
}

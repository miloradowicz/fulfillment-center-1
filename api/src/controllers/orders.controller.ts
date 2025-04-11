import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { OrdersService } from '../services/orders.service'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'
import { FileUploadInterceptor } from '../utils/uploadFiles'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAllOrders(@Query('client') client?: string) {
    if (client === '1') {
      return this.ordersService.getAllWithClient()
    }
    return this.ordersService.getAll()
  }

  @Get('archived/all')
  async getAllArchivedOrders() {
    return this.ordersService.getAllArchived()
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string, @Query('populate') populate: string) {
    if (populate === 'true') {
      return this.ordersService.getByIdWithPopulate(id)
    }
    return this.ordersService.getById(id)
  }

  @Get('archived/:id')
  async getArchivedOrder(@Param('id') id: string) {
    return this.ordersService.getArchivedById(id)
  }

  @Post()
  @UseInterceptors(FileUploadInterceptor())
  async createOrder(@Body() orderDto: CreateOrderDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.ordersService.create(orderDto, files)
  }

  @Put(':id')
  @UseInterceptors(FileUploadInterceptor())
  async updateOrder(@Param('id') id: string, @Body() orderDto: UpdateOrderDto, @UploadedFiles() files: Array<Express.Multer.File>,) {
    return this.ordersService.update(id, orderDto, files)
  }

  @Patch(':id/archive')
  async archiveOrder(@Param('id') id: string) {
    return this.ordersService.archive(id)
  }

  @Patch(':id/unarchive')
  async unarchiveOrder(@Param('id') id: string) {
    return this.ordersService.unarchive(id)
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.delete(id)
  }
}

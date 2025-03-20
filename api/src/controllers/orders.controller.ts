import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { OrdersService } from '../services/orders.service'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'

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

  @Get(':id')
  async getOrderById(@Param('id') id: string, @Query('populate') populate: string) {
    if (populate === 'true') {
      return this.ordersService.getByIdWithPopulate(id)
    }
    return this.ordersService.getById(id)
  }

  @Post()
  async createOrder(@Body() orderDto: CreateOrderDto) {
    return this.ordersService.create(orderDto)
  }

  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() orderDto: UpdateOrderDto) {
    return this.ordersService.update(id, orderDto)
  }

  @Patch(':id/archive')
  async archiveOrder(@Param('id') id: string) {
    return this.ordersService.archive(id)
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.delete(id)
  }
}

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
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { OrdersService } from '../services/orders.service'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'
import { FileUploadInterceptor } from '../utils/uploadFiles'
import { Roles } from 'src/decorators/roles.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { RequestWithUser } from 'src/types'

@UseGuards(RolesGuard)
@Roles('stock-worker', 'manager', 'admin', 'super-admin')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAllOrders(@Query('client') clientId?: string, @Query('populate') populate?: string) {
    if (clientId) {
      return await this.ordersService.getAllByClient(clientId, populate === '1')
    } else {
      return await this.ordersService.getAll(populate === '1')
    }
  }

  @Roles('super-admin')
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

  @Roles('super-admin')
  @Get('archived/:id')
  async getArchivedOrder(@Param('id') id: string) {
    return this.ordersService.getArchivedById(id)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Post()
  @UseInterceptors(FileUploadInterceptor())
  async createOrder(@Body() orderDto: CreateOrderDto, @UploadedFiles() files: Array<Express.Multer.File>, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.ordersService.create(orderDto, files, userId)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Put(':id')
  @UseInterceptors(FileUploadInterceptor())
  async updateOrder(
    @Param('id') id: string,
    @Body() orderDto: UpdateOrderDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: RequestWithUser
  ) {
    const userId = req.user._id
    return this.ordersService.update(id, orderDto, files, userId)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/archive')
  async archiveOrder(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.ordersService.archive(id, userId)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/unarchive')
  async unarchiveOrder(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.ordersService.unarchive(id, userId)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Delete(':id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.ordersService.cancel(id)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.delete(id)
  }
}

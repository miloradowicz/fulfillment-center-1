import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { UpdateLogDto } from 'src/dto/update-log.dto'
import { Arrival } from 'src/schemas/arrival.schema'
import { Order } from 'src/schemas/order.schema'
import { Product } from 'src/schemas/product.schema'
import { LogsService } from 'src/services/logs.service'
import { User } from 'src/decorators/user.param-decorator'
import { Roles } from 'src/decorators/roles.decorator'
import { HydratedUser } from 'src/types'

@Controller('logs')
export class LogsController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly logsService: LogsService
  ) { }

  @Roles('stock-worker', 'super-admin', 'admin', 'manager')
  @Post()
  async addLogEntry(
    @Body() logDto: UpdateLogDto,
    @User() user: HydratedUser,
  ) {
    const { collection, document: id, ...rest } = { ...logDto, user: user._id }

    let modelName: string

    switch (collection) {
      case 'arrivals':
        modelName = Arrival.name
        break

      case 'orders':
        modelName = Order.name
        break

      case 'products':
        modelName = Product.name
        break

      default:
        throw new BadRequestException('Модель не поддерживает логирование.')
    }

    const model = this.connection.models[modelName]

    return await this.logsService.addLogEntry(model, id, rest)
  }

  @Get()
  async getAllLogEntries(
    @Query('collection') collection: string,
    @Query('document') id: string
  ) {
    if (!collection || !id) {
      throw new BadRequestException('Параметры коллекция и документ обязательны.')
    }

    let modelName: string

    switch (collection) {
      case 'arrivals':
        modelName = Arrival.name
        break

      case 'orders':
        modelName = Order.name
        break

      case 'products':
        modelName = Product.name
        break

      default:
        throw new BadRequestException('Модель не поддерживает логирование.')
    }

    const model = this.connection.models[modelName]

    return await this.logsService.getAllLogEntries(model, id)
  }
}

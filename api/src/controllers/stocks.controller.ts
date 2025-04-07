import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common'
import { StocksService } from '../services/stocks.service'
import { CreateStockDto } from '../dto/create-stock.dto'
import { UpdateStockDto } from '../dto/update-stock.dto'
import { Roles } from 'src/decorators/roles.decorator'
import { RolesGuard } from 'src/guards/roles.guard'

@UseGuards(RolesGuard)
@Roles('stock-worker', 'manager', 'admin', 'super-admin')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks() {
    return await this.stocksService.getAll()
  }

  @Roles('super-admin')
  @Get('archived/all')
  async getAllArchivedStocks() {
    return this.stocksService.getAllArchived()
  }

  @Get(':id')
  async getOneStock(@Param('id') id: string) {
    return this.stocksService.getOne(id)
  }

  @Roles('super-admin')
  @Get('archived/:id')
  async getArchivedStockById(@Param('id') id: string) {
    return this.stocksService.getArchivedById(id)
  }

  @Roles('super-admin', 'admin')
  @Post()
  async createStock(@Body() stockDto: CreateStockDto) {
    return this.stocksService.create(stockDto)
  }

  @Roles('super-admin', 'admin')
  @Put(':id')
  async updateStock(@Param('id') id: string, @Body() stockDto: UpdateStockDto) {
    return await this.stocksService.update(id, stockDto)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/archive')
  async archiveStock(@Param('id') id: string) {
    return await this.stocksService.archive(id)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteStock(@Param('id') id: string) {
    return this.stocksService.delete(id)
  }
}

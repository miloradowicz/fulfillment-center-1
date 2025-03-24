import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { StocksService } from '../services/stocks.service'
import { CreateStockDto } from '../dto/create-stock.dto'
import { UpdateStockDto } from '../dto/update-stock.dto'

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks() {
    return await this.stocksService.getAll()
  }

  @Get(':id')
  async getOneStock(@Param('id') id: string) {
    return this.stocksService.getOne(id)
  }

  @Post()
  async createStock(@Body() stockDto: CreateStockDto) {
    return this.stocksService.create(stockDto)
  }

  @Put(':id')
  async updateStock(@Param('id') id: string, @Body() stockDto: UpdateStockDto) {
    return await this.stocksService.update(id, stockDto)
  }

  @Patch(':id/archive')
  async archiveStock(@Param('id') id: string) {
    return await this.stocksService.archive(id)
  }

  @Delete(':id')
  async deleteStock(@Param('id') id: string) {
    return this.stocksService.delete(id)
  }
}

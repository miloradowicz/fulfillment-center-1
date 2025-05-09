import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common'
import { StocksService } from '../services/stocks.service'
import { CreateStockDto } from '../dto/create-stock.dto'
import { UpdateStockDto } from '../dto/update-stock.dto'
import { Roles } from 'src/decorators/roles.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { CreateWriteOffDto } from 'src/dto/create-write-off.dto'
import { RequestWithUser } from '../types'

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
  async createStock(@Body() stockDto: CreateStockDto, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.stocksService.create(stockDto, userId)
  }

  @Roles('super-admin', 'admin')
  @Put(':id')
  async updateStock(@Param('id') id: string, @Body() stockDto: UpdateStockDto, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return await this.stocksService.update(id, stockDto, userId)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/write-offs')
  async createWriteOff(@Param('id') id: string, @Body() writeOffDto: CreateWriteOffDto, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return await this.stocksService.createWriteOff(id, writeOffDto, userId)
  }

  @Patch(':id/archive')
  async archiveStock(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return await this.stocksService.archive(id, userId)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/unarchive')
  async unarchiveStock(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.stocksService.unarchive(id, userId)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteStock(@Param('id') id: string) {
    return this.stocksService.delete(id)
  }
}

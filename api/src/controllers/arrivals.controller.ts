import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CreateArrivalDto } from '../dto/create-arrival.dto'
import { ArrivalsService } from '../services/arrivals.service'
import { UpdateArrivalDto } from '../dto/update-arrival.dto'

@Controller('arrivals')
export class ArrivalsController {
  constructor(private readonly arrivalsService: ArrivalsService) {}

  @Get()
  async getAllArrivals(@Query('client') clientId: string, @Query('populate') populate?: string) {
    if (clientId) {
      return await this.arrivalsService.getAllByClient(clientId, populate === '1')
    } else {
      return await this.arrivalsService.getAll(populate === '1')
    }
  }

  @Get(':id')
  async getOneArrival(
    @Param('id') id: string,
    @Query('populate') populate: string
  ) {
    return this.arrivalsService.getOne(id, populate === '1')
  }

  @Post()
  async createArrival(@Body() arrivalDto: CreateArrivalDto) {
    return this.arrivalsService.create(arrivalDto)
  }

  @Put(':id')
  async updateArrival(@Param('id') id: string, @Body() arrivalDto: UpdateArrivalDto) {
    return await this.arrivalsService.update(id, arrivalDto)
  }

  @Delete(':id')
  async deleteArrival(@Param('id') id: string) {
    return this.arrivalsService.delete(id)
  }
}

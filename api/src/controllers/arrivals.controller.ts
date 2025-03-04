import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CreateArrivalDto } from '../dto/create-arrival.dto'
import { ArrivalsService } from '../services/arrivals.service'
import { UpdateArrivalDto } from '../dto/update-arrival.dto'

@Controller('arrivals')
export class ArrivalsController {
  constructor(private arrivalsService: ArrivalsService) {}

  @Get()
  async getAllArrivals() {
    return this.arrivalsService.getAll()
  }

  @Get(':id')
  async getOneArrival(@Param('id') id: string) {
    return this.arrivalsService.getOne(id)
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

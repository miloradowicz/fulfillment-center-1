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
import { CreateArrivalDto } from '../dto/create-arrival.dto'
import { ArrivalsService } from '../services/arrivals.service'
import { UpdateArrivalDto } from '../dto/update-arrival.dto'
import { FileUploadInterceptor } from '../utils/uploadFiles'

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

  @Get('archived/all')
  async getAllArchivedArrivals(@Query('populate') populate?: string) {
    return await this.arrivalsService.getArchivedAll(populate === '1')
  }

  @Get(':id')
  async getOneArrival(@Param('id') id: string, @Query('populate') populate: string) {
    return this.arrivalsService.getOne(id, populate === '1')
  }

  @Get('archived/:id')
  async getOneArchivedArrival(@Param('id') id: string, @Query('populate') populate: string) {
    return this.arrivalsService.getArchivedOne(id, populate === '1')
  }

  @Post()
  @UseInterceptors(FileUploadInterceptor())
  async createArrival(@Body() arrivalDto: CreateArrivalDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.arrivalsService.create(arrivalDto, files)
  }

  @Put(':id')
  @UseInterceptors(FileUploadInterceptor())

  async updateArrival(
    @Param('id') id: string,
    @Body() arrivalDto: UpdateArrivalDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return await this.arrivalsService.update(id, arrivalDto, files)
  }

  @Patch(':id/archive')
  async archiveArrival(@Param('id') id: string) {
    return await this.arrivalsService.archive(id)
  }

  @Patch(':id/unarchive')
  async unarchiveArrival(@Param('id') id: string) {
    return this.arrivalsService.unarchive(id)
  }

  @Delete(':id')
  async deleteArrival(@Param('id') id: string) {
    return this.arrivalsService.delete(id)
  }
}

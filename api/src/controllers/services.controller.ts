import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { ServicesService } from '../services/services.service'
import { CreateServiceDto } from '../dto/create-service.dto'
import { UpdateServiceDto } from '../dto/update-service.dto'

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices(@Query('name') name?: string) {
    if (name) {
      return this.servicesService.getAllByName(name)
    }
    return this.servicesService.getAll()
  }

  @Get('archived/all')
  async getAllArchivedServices() {
    return this.servicesService.getAllArchived()
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return this.servicesService.getById(id)
  }

  @Get('archived/:id')
  async getArchivedServiceById(@Param('id') id: string) {
    return this.servicesService.getArchivedById(id)
  }

  @Post()
  async createService(@Body() serviceDto: CreateServiceDto) {
    return this.servicesService.create(serviceDto)
  }

  @Put(':id')
  async updateService(@Param('id') id: string, @Body() serviceDto: UpdateServiceDto) {
    return this.servicesService.update(id, serviceDto)
  }

  @Patch(':id/archive')
  async archiveService(@Param('id') id: string) {
    return this.servicesService.archive(id)
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return this.servicesService.delete(id)
  }
}

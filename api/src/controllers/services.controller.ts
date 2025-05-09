import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { ServicesService } from '../services/services.service'
import { CreateServiceDto } from '../dto/create-service.dto'
import { UpdateServiceDto } from '../dto/update-service.dto'
import { Roles } from 'src/decorators/roles.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { RequestWithUser } from 'src/types'

@UseGuards(RolesGuard)
@Roles('stock-worker', 'manager', 'admin', 'super-admin')
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

  @Roles('super-admin')
  @Get('archived/all')
  async getAllArchivedServices() {
    return this.servicesService.getAllArchived()
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return this.servicesService.getById(id)
  }

  @Roles('super-admin')
  @Get('archived/:id')
  async getArchivedServiceById(@Param('id') id: string) {
    return this.servicesService.getArchivedById(id)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/unarchive')
  async unarchiveService(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.servicesService.unarchive(id, userId)
  }

  @Post()
  async createService(@Body() serviceDto: CreateServiceDto, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.servicesService.create(serviceDto, userId)
  }

  @Put(':id')
  async updateService(@Param('id') id: string, @Body() serviceDto: UpdateServiceDto, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.servicesService.update(id, serviceDto, false, userId)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/archive')
  async archiveService(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.servicesService.archive(id, userId)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return this.servicesService.delete(id)
  }
}

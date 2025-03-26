import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { ServiceCategoriesService } from '../services/service-categories.service'
import { CreateServiceCategoryDto } from '../dto/create-service-category.dto'
import { UpdateServiceCategoryDto } from '../dto/update-service-category.dto'

@Controller('servicecategories')
export class ServiceCategoriesController {
  constructor(private readonly serviceCategoryService: ServiceCategoriesService) {}

  @Get()
  async getAllServiceCategories() {
    return this.serviceCategoryService.getAll()
  }

  @Get('archived/all')
  async getAllArchivedServiceCategories() {
    return this.serviceCategoryService.getAllArchived()
  }

  @Get(':id')
  async getServiceCategoryById(@Param('id') id: string) {
    return this.serviceCategoryService.getById(id)
  }

  @Get('archived/:id')
  async getArchivedServiceCategoryById(@Param('id') id: string) {
    return this.serviceCategoryService.getArchivedById(id)
  }

  @Post()
  async createServiceCategory(@Body() serviceCategoryDto: CreateServiceCategoryDto) {
    return this.serviceCategoryService.create(serviceCategoryDto)
  }

  @Put(':id')
  async updateCounterparty(@Param('id') id: string, @Body() serviceCategoryDto: UpdateServiceCategoryDto) {
    return this.serviceCategoryService.update(id, serviceCategoryDto)
  }

  @Patch(':id/archive')
  async archiveServiceCategory(@Param('id') id: string) {
    return this.serviceCategoryService.archive(id)
  }

  @Delete(':id')
  async deleteServiceCategory(@Param('id') id: string) {
    return this.serviceCategoryService.delete(id)
  }
}

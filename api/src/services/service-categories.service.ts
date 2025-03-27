import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ServiceCategory, ServiceCategoryDocument } from '../schemas/service-category.schema'
import { Model } from 'mongoose'
import { CreateServiceCategoryDto } from '../dto/create-service-category.dto'
import { UpdateServiceCategoryDto } from '../dto/update-service-category.dto'

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectModel(ServiceCategory.name) private readonly serviceCategoryModel: Model<ServiceCategoryDocument>,
  ) {}

  async getAll() {
    return this.serviceCategoryModel.find({ isArchived: false }).exec()
  }

  async getAllArchived() {
    return this.serviceCategoryModel.find({ isArchived: true }).exec()
  }

  async getById(id: string) {
    const serviceCategory = await this.serviceCategoryModel.findById(id).exec()

    if (!serviceCategory) throw new NotFoundException('Категория услуги не найдена')

    if (serviceCategory.isArchived) throw new ForbiddenException('Категория услуги в архиве')

    return serviceCategory
  }

  async getArchivedById(id: string) {
    const serviceCategory = await this.serviceCategoryModel.find({ isArchived: true }).findById(id).exec()

    if (!serviceCategory) throw new NotFoundException('Категория услуги в архиве не найдена')

    return serviceCategory
  }

  async create(serviceCategoryDto: CreateServiceCategoryDto) {
    return this.serviceCategoryModel.create(serviceCategoryDto)
  }

  async update(id: string, serviceCategoryDto: UpdateServiceCategoryDto, force: boolean = false) {
    const serviceCategory = await this.serviceCategoryModel.findById(id).exec()

    if (!serviceCategory) throw new NotFoundException('Категория услуги не найдена')

    if (!force && serviceCategory.isArchived) throw new ForbiddenException('Категория услуги в архиве')

    serviceCategory.set(serviceCategoryDto)
    await serviceCategory.save()

    return serviceCategory
  }

  async archive(id: string) {
    const serviceCategory = await this.serviceCategoryModel.findById(id).exec()

    if (!serviceCategory) throw new NotFoundException('Категория услуги не найдена')

    if (serviceCategory.isArchived) throw new ForbiddenException('Категория услуги уже в архиве')

    serviceCategory.isArchived = true
    await serviceCategory.save()

    return { message: 'Категория услуги перемещена в архив' }
  }

  async delete(id: string) {
    const serviceCategory = await this.serviceCategoryModel.findByIdAndDelete(id).exec()
    if (!serviceCategory) throw new NotFoundException('Категория услуги не найдена')
    return { message: 'Категория услуги успешно удалена' }
  }
}

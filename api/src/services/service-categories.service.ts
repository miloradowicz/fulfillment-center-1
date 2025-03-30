import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ServiceCategory, ServiceCategoryDocument } from '../schemas/service-category.schema'
import { Model } from 'mongoose'
import { CreateServiceCategoryDto } from '../dto/create-service-category.dto'
import { UpdateServiceCategoryDto } from '../dto/update-service-category.dto'
import { Service, ServiceDocument } from 'src/schemas/service.schema'
import { ServicesService } from './services.service'

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectModel(ServiceCategory.name) private readonly serviceCategoryModel: Model<ServiceCategoryDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    private readonly servicesService: ServicesService,
  ) {}

  async getAll() {
    return this.serviceCategoryModel.find({ isArchived: false }).exec()
  }

  async getAllArchived() {
    return this.serviceCategoryModel.find({ isArchived: true }).exec()
  }

  async getById(id: string) {
    const serviceCategory = await this.serviceCategoryModel.findById(id).exec()

    if (!serviceCategory) throw new NotFoundException('Категория услуг не найдена')

    if (serviceCategory.isArchived) throw new ForbiddenException('Категория услуг в архиве')

    return serviceCategory
  }

  async getArchivedById(id: string) {
    const serviceCategory = await this.serviceCategoryModel.find({ isArchived: true }).findById(id).exec()

    if (!serviceCategory) throw new NotFoundException('Категория услуг в архиве не найдена')

    return serviceCategory
  }

  async create(serviceCategoryDto: CreateServiceCategoryDto) {
    return this.serviceCategoryModel.create(serviceCategoryDto)
  }

  async update(id: string, serviceCategoryDto: UpdateServiceCategoryDto, force: boolean = false) {
    const serviceCategory = await this.serviceCategoryModel.findById(id).exec()

    if (!serviceCategory) throw new NotFoundException('Категория услуг не найдена')

    if (!force && serviceCategory.isArchived) throw new ForbiddenException('Категория услуг в архиве')

    serviceCategory.set(serviceCategoryDto)
    await serviceCategory.save()

    return serviceCategory
  }

  async isLocked(id: string) {
    const serviceCategory = await this.serviceCategoryModel.findById(id)

    if (!serviceCategory) throw new NotFoundException('Категория услуг не найдена')

    const services = await this.serviceModel.find({ serviceCategory: serviceCategory._id })

    if (!services.length) return false

    return await Promise.any(services.map(x => this.servicesService.isLocked(String(x._id))))
  }

  async archive(id: string) {
    if (await this.isLocked(id))
      throw new ForbiddenException('Категория услуг не может быть перемещена в архив, поскольку уже содержит услуги.',)

    const serviceCategory = await this.serviceCategoryModel.findById(id).exec()

    if (!serviceCategory) throw new NotFoundException('Категория услуг не найдена')

    if (serviceCategory.isArchived) throw new ForbiddenException('Категория услуг уже в архиве')

    serviceCategory.isArchived = true
    await serviceCategory.save()

    return { message: 'Категория услуг перемещена в архив' }
  }

  async delete(id: string) {
    if (await this.isLocked(id))
      throw new ForbiddenException('Категория услуг не может быть удалена, поскольку уже содержит услуги.')

    const serviceCategory = await this.serviceCategoryModel.findByIdAndDelete(id).exec()
    if (!serviceCategory) throw new NotFoundException('Категория услуг не найдена')
    return { message: 'Категория услуг успешно удалена' }
  }
}

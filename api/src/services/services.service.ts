import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Service, ServiceDocument } from '../schemas/service.schema'
import { CreateServiceDto } from '../dto/create-service.dto'
import { UpdateServiceDto } from '../dto/update-service.dto'

@Injectable()
export class ServicesService {
  constructor(@InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>) { }

  async getAll() {
    return this.serviceModel.find({ isArchived: false }).populate('serviceCategory').exec()
  }

  async getAllByName(name: string) {
    return this.serviceModel.find({ isArchived: false }).find({ name: { $regex: name, $options: 'i' } }).populate('serviceCategory').exec()
  }

  async getById(id: string) {
    const service = await this.serviceModel.findById(id).populate('serviceCategory').exec()

    if (!service) throw new NotFoundException('Услуга не найдена')

    if (service.isArchived) throw new ForbiddenException('Услуга в архиве')

    return service
  }

  async getAllArchived() {
    return this.serviceModel.find({ isArchived: true }).populate('serviceCategory').exec()
  }

  async getAllByNameArchived(name: string) {
    return this.serviceModel.find({ isArchived: true }).find({ name: { $regex: name, $options: 'i' } }).populate('serviceCategory').exec()
  }

  async getByIdArchived(id: string) {
    const service = await this.serviceModel.find({ isArchived: true }).findById(id).populate('serviceCategory').exec()

    if (!service) throw new NotFoundException('Услуга не найдена в архиве')

    return service
  }

  async create(serviceDto: CreateServiceDto) {
    return (await this.serviceModel.create(serviceDto)).populate('serviceCategory')
  }

  async update(id: string, serviceDto: UpdateServiceDto, force: boolean = false) {
    const service = await this.serviceModel.findById(id)

    if (!service) throw new NotFoundException('Услуга не найдена')

    if (!force && service.isArchived) throw new ForbiddenException('Услуга в архиве')

    service.set(serviceDto)
    await service.save()

    return service.populate('serviceCategory')
  }

  async archive(id: string) {
    const service = await this.serviceModel.findByIdAndUpdate(id, { isArchived: true })

    if (!service) throw new NotFoundException('Услуга не найдена')

    if (service.isArchived) throw new ForbiddenException('Услуга уже в архиве')

    return { message: 'Услуга перемещена в архив' }
  }

  async delete(id: string) {
    const service = await this.serviceModel.findByIdAndDelete(id)
    if (!service) throw new NotFoundException('Услуга не найдена')
    return { message: 'Услуга успешно удалёна' }
  }
}

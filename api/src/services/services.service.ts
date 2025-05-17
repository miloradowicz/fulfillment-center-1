import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { Service, ServiceDocument } from '../schemas/service.schema'
import { CreateServiceDto } from '../dto/create-service.dto'
import { UpdateServiceDto } from '../dto/update-service.dto'
import { LogsService } from './logs.service'

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    private readonly logsService: LogsService,
  ) {}

  async getAll() {
    return this.serviceModel.find({ isArchived: false }).populate('serviceCategory').exec()
  }

  async getAllArchived() {
    return this.serviceModel.find({ isArchived: true }).populate('serviceCategory').exec()
  }

  async getAllByName(name: string) {
    return this.serviceModel
      .find({ isArchived: false })
      .find({ name: { $regex: name, $options: 'i' } })
      .populate('serviceCategory')
      .exec()
  }

  async getById(id: string) {
    const service = await this.serviceModel.findById(id).populate('serviceCategory').populate({ path: 'logs.user', select: '-password -token' }).exec()

    if (!service) throw new NotFoundException('Услуга не найдена')

    if (service.isArchived) throw new ForbiddenException('Услуга в архиве')

    return service
  }

  async getAllArchivedByName(name: string) {
    return this.serviceModel
      .find({ isArchived: true })
      .find({ name: { $regex: name, $options: 'i' } })
      .populate('serviceCategory')
      .exec()
  }

  async getArchivedById(id: string) {
    const service = await this.serviceModel.findById(id).populate('serviceCategory').exec()

    if (!service) throw new NotFoundException('Услуга не найдена')

    if (!service.isArchived) throw new ForbiddenException('Эта услуга не в архиве')

    return service
  }

  async create(serviceDto: CreateServiceDto, userId: mongoose.Types.ObjectId) {
    const log = this.logsService.generateLogForCreate(userId)

    const serviceToCreate = {
      ...serviceDto,
      logs: [log],
    }

    return (await this.serviceModel.create(serviceToCreate)).populate('serviceCategory')
  }

  async update(id: string, serviceDto: UpdateServiceDto, force: boolean = false, userId: mongoose.Types.ObjectId) {
    const service = await this.serviceModel.findById(id)

    if (!service) throw new NotFoundException('Услуга не найдена')

    if (!force && service.isArchived) throw new ForbiddenException('Услуга в архиве')

    const serviceDtoObj = { ...serviceDto }

    const log = this.logsService.trackChanges(
      service.toObject(),
      serviceDtoObj,
      userId,
    )

    service.set(serviceDto)

    if (log) {
      service.logs.push(log)
    }

    await service.save()

    return service.populate('serviceCategory')
  }

  async isLocked(id: string) {
    const service = await this.serviceModel.findById(id)

    if (!service) throw new NotFoundException('Товар не найден')

    return true
  }

  async archive(id: string, userId: mongoose.Types.ObjectId) {
    const service = await this.serviceModel.findById(id)

    if (!service) throw new NotFoundException('Услуга не найдена')

    if (service.isArchived) throw new ForbiddenException('Услуга уже в архиве')

    service.isArchived = true
    const log = this.logsService.generateLogForArchive(userId, service.isArchived)
    service.logs.push(log)

    await service.save()

    return { message: 'Услуга перемещена в архив' }
  }

  async unarchive(id: string, userId: mongoose.Types.ObjectId) {
    const service = await this.serviceModel.findById(id)

    if (!service) throw new NotFoundException('Услуга не найдена')

    if (!service.isArchived) throw new ForbiddenException('Услуга не находится в архиве')

    service.isArchived = false
    const log = this.logsService.generateLogForArchive(userId, service.isArchived)
    service.logs.push(log)

    await service.save()

    return { message: 'Услуга восстановлена из архива' }
  }

  async delete(id: string) {
    const service = await this.serviceModel.findByIdAndDelete(id)
    if (!service) throw new NotFoundException('Услуга не найдена')
    return { message: 'Услуга успешно удалёна' }
  }
}

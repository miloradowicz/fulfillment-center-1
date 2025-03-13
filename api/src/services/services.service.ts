import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Service, ServiceDocument } from '../schemas/service.schema'
import { CreateServiceDto } from '../dto/create-service.dto'
import { UpdateServiceDto } from '../dto/update-service.dto'

@Injectable()
export class ServicesService {
  constructor(@InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>) {}

  async getAll() {
    return this.serviceModel.find()
  }

  async getAllByName(name: string) {
    return this.serviceModel.find({ 'name': { $regex: name, $options: 'i' } })
  }

  async getById(id: string) {
    const service = await this.serviceModel.findById(id).exec()
    if (!service) throw new NotFoundException('Услуга не найдена')
    return service
  }

  async create(serviceDto: CreateServiceDto) {
    return await this.serviceModel.create(serviceDto)
  }

  async update(id: string, serviceDto: UpdateServiceDto) {
    const service = await this.serviceModel.findByIdAndUpdate(id, serviceDto, { new: true })
    if (!service) {
      throw new NotFoundException('Услуга не найдена')
    }
    return service
  }

  async delete(id: string) {
    const service = await this.serviceModel.findByIdAndDelete(id)
    if (!service) throw new NotFoundException('Услуга не найдена')
    return { message: 'Услуга успешно удалёна' }
  }
}

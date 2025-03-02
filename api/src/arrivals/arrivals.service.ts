import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { CreateArrivalDto } from '../dto/create-arrival.dto'
import { UpdateArrivalDto } from '../dto/update-arrival.dto'

@Injectable()
export class ArrivalsService {
  constructor(@InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>) {}

  async getAll() {
    return this.arrivalModel.find()
  }

  async getOne(id: string) {
    const arrival = await this.arrivalModel.findById(id)
    if (!arrival) throw new NotFoundException('Поставка не найдена.')
    return arrival
  }

  async create(arrivalDto: CreateArrivalDto) {
    return await this.arrivalModel.create(arrivalDto)
  }

  async update(id: string, arrivalDto: UpdateArrivalDto) {
    const arrival = await this.arrivalModel.findByIdAndUpdate(id, arrivalDto)
    if (!arrival) {
      throw new NotFoundException('Поставка не найдена.')
    }
    return arrival
  }

  async delete(id: string) {
    const arrival = await this.arrivalModel.findById(id)
    if (!arrival) throw new NotFoundException('Поставка не найдена.')
    await this.arrivalModel.findByIdAndDelete(id)
    return { message: 'Поставка успешно удалена.' }
  }
}

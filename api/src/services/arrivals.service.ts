import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { CreateArrivalDto } from '../dto/create-arrival.dto'
import { UpdateArrivalDto } from '../dto/update-arrival.dto'

@Injectable()
export class ArrivalsService {
  constructor(@InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>) {}

  async getAllByClient(clientId: string, populate: boolean) {
    if (populate) {
      return (await this.arrivalModel.find({ client: clientId }).populate('client')).reverse()
    } else {
      return (await this.arrivalModel.find({ client: clientId })).reverse()
    }
  }

  async getAll(populate: boolean) {
    if (populate) {
      return (await this.arrivalModel.find().populate('client')).reverse()
    }
    return (await this.arrivalModel.find()).reverse()
  }

  async getOne(id: string, populate: boolean) {
    let arrival: ArrivalDocument | null

    if (populate) {
      arrival = await this.arrivalModel.findById(id)
        .populate('client products.product defects.product received_amount.product')
        .populate({ path: 'logs.user', select: '-password -token' })
    } else {
      arrival = await this.arrivalModel.findById(id)
    }

    if (!arrival) throw new NotFoundException('Поставка не найдена.')
    return arrival
  }

  async create(arrivalDto: CreateArrivalDto) {
    return await this.arrivalModel.create(arrivalDto)
  }

  async update(id: string, arrivalDto: UpdateArrivalDto) {
    const arrival = await this.arrivalModel.findByIdAndUpdate(id, arrivalDto, { new: true })
    if (!arrival) {
      throw new NotFoundException('Поставка не найдена.')
    }
    return arrival
  }

  async delete(id: string) {
    const arrival = await this.arrivalModel.findByIdAndDelete(id)
    if (!arrival) throw new NotFoundException('Поставка не найдена.')
    return { message: 'Поставка успешно удалена.' }
  }
}

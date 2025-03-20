import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { CreateArrivalDto } from '../dto/create-arrival.dto'
import { UpdateArrivalDto } from '../dto/update-arrival.dto'

@Injectable()
export class ArrivalsService {
  constructor(@InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>) {}

  async getAllByClient(clientId: string, populate: boolean) {
    const unarchived = this.arrivalModel.find({ isArchived: false })

    if (populate) {
      return (await unarchived.find({ client: clientId }).populate('client')).reverse()
    }

    return (await unarchived.find({ client: clientId })).reverse()
  }

  async getAll(populate: boolean) {
    const unarchived = this.arrivalModel.find({ isArchived: false })

    if (populate) {
      return (await unarchived.populate('client').populate('stock').exec()).reverse()
    }

    return (await unarchived).reverse()
  }

  async getOne(id: string, populate: boolean) {
    let arrival: ArrivalDocument | null

    if (populate) {
      arrival = await this.arrivalModel
        .findById(id)
        .populate('client products.product defects.product received_amount.product stock')
        .populate({ path: 'logs.user', select: '-password -token' })
    } else {
      arrival = await this.arrivalModel.findById(id)
    }

    if (!arrival) throw new NotFoundException('Поставка не найдена.')

    if (arrival.isArchived) throw new ForbiddenException('Поставка в архиве.')

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

  async archive(id: string) {
    const arrival = await this.arrivalModel.findByIdAndUpdate(id, { isArchived: true })

    if (!arrival) throw new NotFoundException('Поставка не найдена.')

    if (arrival.isArchived) throw new ForbiddenException('Поставка уже в архиве.')

    return { message: 'Поставка перемещена в архив.' }
  }

  async delete(id: string) {
    const arrival = await this.arrivalModel.findByIdAndDelete(id)
    if (!arrival) throw new NotFoundException('Поставка не найдена.')
    return { message: 'Поставка успешно удалена.' }
  }
}

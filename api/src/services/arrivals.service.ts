import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { UpdateArrivalDto } from '../dto/update-arrival.dto'
import { CounterService } from './counter.service'
import { CreateArrivalDto } from '../dto/create-arrival.dto'

@Injectable()
export class ArrivalsService {
  constructor(
    @InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>,
    private counterService: CounterService
  ) {}

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
      return (await unarchived.populate('client stock shipping_agent').exec()).reverse()
    }

    return (await unarchived).reverse()
  }

  async getArchivedAll(populate: boolean) {
    const archived = this.arrivalModel.find({ isArchived: true })

    if (populate) {
      return (await archived.populate('client stock shipping_agent').exec()).reverse()
    }

    return (await archived).reverse()
  }

  async getOne(id: string, populate: boolean) {
    let arrival: ArrivalDocument | null

    if (populate) {
      arrival = await this.arrivalModel
        .findById(id)
        .populate('client products.product defects.product received_amount.product stock shipping_agent')
        .populate({ path: 'logs.user', select: '-password -token' })
    } else {
      arrival = await this.arrivalModel.findById(id)
    }

    if (!arrival) throw new NotFoundException('Поставка не найдена.')

    if (arrival.isArchived) throw new ForbiddenException('Поставка в архиве.')

    return arrival
  }

  async getArchivedOne(id: string, populate: boolean) {
    let arrival: ArrivalDocument | null

    if (populate) {
      arrival = await this.arrivalModel
        .findById(id)
        .populate('client products.product defects.product received_amount.product stock shipping_agent')
        .populate({ path: 'logs.user', select: '-password -token' })
    } else {
      arrival = await this.arrivalModel.findById(id)
    }

    if (!arrival) throw new NotFoundException('Поставка не найдена.')
    if (!arrival.isArchived) throw new ForbiddenException('Эта поставка не в архиве.')

    return arrival
  }

  async create(arrivalDto: CreateArrivalDto) {
    try {
      const newArrival = await this.arrivalModel.create(arrivalDto)

      const sequenceNumber = await this.counterService.getNextSequence('arrival')
      newArrival.arrivalNumber  = `ARL-${ sequenceNumber }`

      return newArrival.save()
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message)
      }
      throw new BadRequestException('Произошла ошибка при создании поставки')
    }
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

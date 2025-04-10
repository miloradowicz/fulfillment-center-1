import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Counterparty, CounterpartyDocument } from '../schemas/counterparty.schema'
import { CreateCounterpartyDto } from '../dto/create-counterparty.dto'
import { UpdateCounterpartyDto } from '../dto/update-counterparty.dto'

@Injectable()
export class CounterpartiesService {
  constructor(@InjectModel(Counterparty.name) private readonly counterpartyModel: Model<CounterpartyDocument>) {}

  async getAll() {
    const counterparties = await this.counterpartyModel.find({ isArchived: false }).exec()
    return counterparties.reverse()
  }

  async getAllArchived() {
    const counterparties = await this.counterpartyModel.find({ isArchived: true }).exec()
    return counterparties.reverse()
  }

  async getById(id: string) {
    const counterparty = await this.counterpartyModel.findById(id).exec()

    if (!counterparty) throw new NotFoundException('Контрагент не найден')

    if (counterparty.isArchived) throw new ForbiddenException('Контрагент в архиве')

    return counterparty
  }

  async getArchivedById(id: string) {
    const counterparty = await this.counterpartyModel.findById(id).exec()

    if (!counterparty) throw new NotFoundException('Контрагент не найден')
    if (!counterparty.isArchived) throw new ForbiddenException('Этот контрагент не в архиве')

    return counterparty
  }

  async create(counterpartyDto: CreateCounterpartyDto) {
    const existingCounterparty = await this.counterpartyModel.findOne({ name: counterpartyDto.name }).exec()
    if (existingCounterparty) {
      throw new BadRequestException({
        message: 'Контрагент с таким именем уже существует',
        errors: { name: 'Имя должно быть уникальным' },
      })
    }

    return this.counterpartyModel.create(counterpartyDto)
  }

  async update(id: string, counterpartyDto: UpdateCounterpartyDto) {
    const existingCounterparty = await this.counterpartyModel.findOne({ name: counterpartyDto.name }).exec()

    if (existingCounterparty && existingCounterparty.id !== id) {
      throw new BadRequestException({
        message: 'Контрагент с таким именем уже существует',
        errors: { name: 'Имя должно быть уникальным' },
      })
    }

    const counterparty = await this.counterpartyModel.findByIdAndUpdate(id, counterpartyDto, { new: true }).exec()
    if (!counterparty) {
      throw new NotFoundException('Контрагент не найден')
    }
    return counterparty
  }

  async archive(id: string) {
    const counterparty = await this.counterpartyModel.findById(id).exec()
    if (!counterparty) throw new NotFoundException('Контрагент не найден')
    if (counterparty.isArchived) throw new ForbiddenException('Контрагент уже в архиве')

    counterparty.isArchived = true
    await counterparty.save()

    return { message: 'Контрагент перемещен в архив' }
  }

  async delete(id: string) {
    const counterparty = await this.counterpartyModel.findByIdAndDelete(id).exec()
    if (!counterparty) throw new NotFoundException('Контрагент не найден')
    return { message: 'Контрагент успешно удалён' }
  }
}

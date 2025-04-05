import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { UpdateArrivalDto } from '../dto/update-arrival.dto'
import { CounterService } from './counter.service'
import { CreateArrivalDto } from '../dto/create-arrival.dto'
import { FilesService } from './files.service'
import { StockManipulationService } from './stock-manipulation.service'

export interface DocumentObject {
  document: string
}

@Injectable()
export class ArrivalsService {
  constructor(
    @InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>,
    private readonly counterService: CounterService,
    private readonly filesService: FilesService,
    private readonly stockManipulationService: StockManipulationService,
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

  async create(arrivalDto: CreateArrivalDto, files: Array<Express.Multer.File> = []) {
    let documents: DocumentObject[] = []

    if (files.length > 0) {
      documents = files.map(file => ({
        document: this.filesService.getFilePath(file.filename),
      }))
    }

    if (arrivalDto.documents) {
      if (typeof arrivalDto.documents === 'string') {
        try {
          arrivalDto.documents = JSON.parse(arrivalDto.documents) as DocumentObject[]
        } catch (_e) {
          arrivalDto.documents = []
        }
      }

      const formattedDocs = Array.isArray(arrivalDto.documents)
        ? arrivalDto.documents.map((doc: DocumentObject | string) =>
          typeof doc === 'string' ? { document: doc } : doc,
        )
        : []

      documents = [...formattedDocs, ...documents]
    }

    const sequenceNumber = await this.counterService.getNextSequence('arrival')

    const newArrival = await this.arrivalModel.create({
      ...arrivalDto,
      documents,
      arrivalNumber: `ARL-${ sequenceNumber }`,
    })

    if ((arrivalDto.arrival_status === 'получена' || arrivalDto.arrival_status === 'отсортирована') && !arrivalDto.received_amount?.length) {
      throw new BadRequestException('Заполните список полученных товаров.')
    }

    if ((arrivalDto.arrival_status === 'получена' || arrivalDto.arrival_status === 'отсортирована') && arrivalDto.received_amount?.length) {
      await this.stockManipulationService.increaseProductStock(arrivalDto.stock, arrivalDto.received_amount)
    }

    if (arrivalDto.arrival_status === 'отсортирована' && arrivalDto.defects?.length) {
      await this.stockManipulationService.decreaseProductStock(arrivalDto.stock, arrivalDto.defects)
    }

    return newArrival
  }

  async update(id: string, arrivalDto: UpdateArrivalDto, files: Array<Express.Multer.File> = []) {
    const existingArrival = await this.arrivalModel.findById(id)
    if (!existingArrival) throw new NotFoundException('Поставка не найдена')

    if (files.length > 0) {
      const documentPaths = files.map(file => ({
        document: this.filesService.getFilePath(file.filename),
      }))
      arrivalDto.documents = [...(existingArrival.documents || []), ...documentPaths]
    }

    const previousStatus = existingArrival.arrival_status
    const newStatus = arrivalDto.arrival_status

    if (previousStatus === 'ожидается доставка' && (newStatus === 'отсортирована' || newStatus === 'получена')) {
      if (!arrivalDto.received_amount?.length) {
        throw new BadRequestException('Заполните список полученных товаров для смены статуса поставки.')
      }
    }

    if (previousStatus === 'получена' && newStatus === 'получена' && !arrivalDto.received_amount?.length) {
      throw new BadRequestException('Для статуса "получена" укажите полученные товары')
    }

    if ((previousStatus === 'получена' || previousStatus === 'отсортирована') && existingArrival.received_amount.length) {
      await this.stockManipulationService.decreaseProductStock(existingArrival.stock, existingArrival.received_amount)
    }

    if (previousStatus === 'отсортирована' && existingArrival.defects.length) {
      await this.stockManipulationService.increaseProductStock(existingArrival.stock, existingArrival.defects)
    }

    const updatedArrival = existingArrival.set(arrivalDto)
    await updatedArrival.save()

    if ((newStatus === 'получена' || newStatus === 'отсортирована') && updatedArrival.received_amount.length) {
      await this.stockManipulationService.increaseProductStock(updatedArrival.stock, updatedArrival.received_amount)
    }

    if (newStatus === 'отсортирована' && updatedArrival.defects.length) {
      await this.stockManipulationService.decreaseProductStock(updatedArrival.stock, updatedArrival.defects)
    }

    return await updatedArrival.populate('received_amount.product')
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

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { UpdateArrivalDto } from '../dto/update-arrival.dto'
import { CounterService } from './counter.service'
import { CreateArrivalDto } from '../dto/create-arrival.dto'
import { FilesService } from './files.service'
import { Stock, StockDocument } from '../schemas/stock.schema'
import { removeDefects, removeStockProducts, updateDefects, updateStockProducts } from '../utils/arrivalUtils'

export interface DocumentObject {
  document: string
}

@Injectable()
export class ArrivalsService {
  constructor(
    @InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>,
    @InjectModel(Stock.name) private readonly stockModel: Model<StockDocument>,
    private counterService: CounterService,
    private readonly filesService: FilesService,
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

    const newArrival = await this.arrivalModel.create({
      ...arrivalDto,
      documents,
    })

    const sequenceNumber = await this.counterService.getNextSequence('arrival')
    newArrival.arrivalNumber = `ARL-${ sequenceNumber }`

    const stock = await this.stockModel.findById(arrivalDto.stock)
    if (!stock) throw new NotFoundException('Указанный склад не найден')

    if (arrivalDto.arrival_status === 'получена' && !arrivalDto.received_amount?.length)
      throw new BadRequestException('Заполните список полученных товаров.')

    if (arrivalDto.arrival_status === 'получена' && arrivalDto.received_amount?.length) {
      updateStockProducts(stock, arrivalDto.received_amount)
      await stock.save()
    }

    if (arrivalDto.arrival_status === 'отсортирована' && arrivalDto.defects?.length) {
      if (!arrivalDto.received_amount?.length) throw new BadRequestException('Заполните список полученных товаров.')
      updateDefects(stock, arrivalDto.defects)
      await stock.save()
    }

    await newArrival.save()
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

    const updateData = { ...arrivalDto }

    const stock = await this.stockModel.findById(existingArrival.stock)
    if (!stock) throw new NotFoundException('Склад не найден')

    const previousStatus = existingArrival.arrival_status
    const newStatus = arrivalDto.arrival_status

    if (previousStatus === 'ожидается доставка' && newStatus === 'отсортирована') {
      if (!arrivalDto.received_amount?.length) {
        throw new BadRequestException('Заполните список полученных товаров для смены статуса поставки.')
      }
    }

    if (previousStatus === 'получена' && newStatus === 'ожидается доставка') {
      removeStockProducts(stock, existingArrival.received_amount)
      await stock.save()
    }

    if (previousStatus === 'ожидается доставка' && newStatus === 'получена') {
      if (!arrivalDto.received_amount?.length) {
        throw new BadRequestException('Заполните список полученных товаров для смены статуса поставки.')
      }
      updateStockProducts(stock, arrivalDto.received_amount)
      await stock.save()
    }

    if (previousStatus === 'получена' && newStatus === 'получена') {
      if (!arrivalDto.received_amount?.length) {
        throw new BadRequestException('Для статуса "получена" укажите полученные товары')
      }

      removeStockProducts(stock, existingArrival.received_amount)
      updateStockProducts(stock, arrivalDto.received_amount)

      await stock.save()
    }

    if (previousStatus === 'получена' && newStatus === 'отсортирована') {
      if (arrivalDto.defects?.length) {
        updateDefects(stock, arrivalDto.defects)
      }
      await stock.save()
    }

    if (previousStatus === 'отсортирована' && newStatus === 'получена') {
      if (arrivalDto.defects?.length) {
        removeDefects(stock, arrivalDto.defects)
      }
      await stock.save()
    }

    if (previousStatus === 'отсортирована' && newStatus === 'отсортирована') {
      removeDefects(stock, existingArrival.defects)

      if (!arrivalDto.defects?.length) {
        arrivalDto.defects = []
      }

      updateDefects(stock, arrivalDto.defects)
      await stock.save()
    }

    return this.arrivalModel.findByIdAndUpdate(id, updateData, { new: true }).populate('received_amount.product')
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

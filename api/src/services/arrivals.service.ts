import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { UpdateArrivalDto } from '../dto/update-arrival.dto'
import { CounterService } from './counter.service'
import { CreateArrivalDto } from '../dto/create-arrival.dto'
import { FilesService } from './files.service'
import { StockManipulationService } from './stock-manipulation.service'
import { LogsService } from './logs.service'
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema'

export interface DocumentObject {
  document: string
}

@Injectable()
export class ArrivalsService {
  constructor(
    @InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>,
    private readonly counterService: CounterService,
    private readonly filesService: FilesService,
    private readonly stockManipulationService: StockManipulationService,
    private readonly logsService: LogsService,
  ) { }

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
    const query = this.arrivalModel.find({ isArchived: true })

    if (populate) {
      query.populate({
        path: 'client stock shipping_agent',
        select: 'name',
      })
    }

    return (await query.exec()).reverse()
  }

  async getOne(id: string, populate: boolean) {
    let arrival: ArrivalDocument | null

    if (populate) {
      arrival = await this.arrivalModel
        .findById(id)
        .populate('client products.product defects.product received_amount.product stock shipping_agent')
        .populate({
          path: 'services.service',
          populate: {
            path: 'serviceCategory',
            model: 'ServiceCategory',
          },
        })
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
        .populate('client products.product defects.product received_amount.product stock shipping_agent services.service')
        .populate({ path: 'logs.user', select: '-password -token' })
    } else {
      arrival = await this.arrivalModel.findById(id)
    }

    if (!arrival) throw new NotFoundException('Поставка не найдена.')
    if (!arrival.isArchived) throw new ForbiddenException('Эта поставка не в архиве.')

    return arrival
  }

  async doStocking(arrival: ArrivalDocument) {
    if (
      (arrival.arrival_status === 'получена' || arrival.arrival_status === 'отсортирована') &&
      arrival.received_amount?.length
    ) {
      await this.stockManipulationService.increaseProductStock(arrival.stock, arrival.received_amount)
    }

    if (arrival.arrival_status === 'отсортирована' && arrival.defects?.length) {
      await this.stockManipulationService.decreaseProductStock(arrival.stock, arrival.defects)
      await this.stockManipulationService.increaseDefectStock(arrival.stock, arrival.defects)
    }
  }

  async undoStocking(arrival: ArrivalDocument) {
    if (
      (arrival.arrival_status === 'получена' || arrival.arrival_status === 'отсортирована') &&
      arrival.received_amount?.length
    ) {
      await this.stockManipulationService.decreaseProductStock(arrival.stock, arrival.received_amount)
    }

    if (arrival.arrival_status === 'отсортирована' && arrival.defects?.length) {
      await this.stockManipulationService.increaseProductStock(arrival.stock, arrival.defects)
      await this.stockManipulationService.decreaseDefectStock(arrival.stock, arrival.defects)
    }
  }

  async create(arrivalDto: CreateArrivalDto, files: Array<Express.Multer.File> = [], userId: mongoose.Types.ObjectId) {
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

    const log = this.logsService.generateLogForCreate(userId)

    const newArrival = await this.arrivalModel.create({
      ...arrivalDto,
      documents,
      arrivalNumber: `ARL-${ sequenceNumber }`,
      logs: [log],
    })

    if (
      (newArrival.arrival_status === 'получена' || newArrival.arrival_status === 'отсортирована') &&
      !newArrival.received_amount?.length
    ) {
      throw new BadRequestException('Заполните список полученных товаров.')
    }

    this.stockManipulationService.init()

    await this.doStocking(newArrival)

    await this.stockManipulationService.saveStock(newArrival.stock)
    return newArrival
  }

  async update(id: string, arrivalDto: UpdateArrivalDto, files: Array<Express.Multer.File> = [], userId: mongoose.Types.ObjectId) {
    const existingArrival = await this.arrivalModel.findById(id)
    if (!existingArrival) throw new NotFoundException('Поставка не найдена')

    const arrivalDtoObj = { ...arrivalDto }

    arrivalDtoObj.received_amount = arrivalDtoObj.received_amount || []
    arrivalDtoObj.defects = arrivalDtoObj.defects || []
    arrivalDtoObj.services = arrivalDtoObj.services || []

    const log = this.logsService.trackChanges(
      existingArrival.toObject(),
      arrivalDtoObj,
      userId,
    )

    if (files.length > 0) {
      const documentPaths = files.map(file => ({
        document: this.filesService.getFilePath(file.filename),
      }))
      arrivalDto.documents = [...(existingArrival.documents || []), ...documentPaths]
    }

    if (!Array.isArray(arrivalDto.services)) {
      arrivalDto.services = []
    }

    const updateData = { ...arrivalDto, services: arrivalDto.services }

    const previousStatus = existingArrival.arrival_status
    const newStatus = updateData.arrival_status ?? previousStatus

    this.stockManipulationService.init()

    if (previousStatus === 'ожидается доставка' && (newStatus === 'отсортирована' || newStatus === 'получена')) {
      if (!updateData.received_amount?.length) {
        throw new BadRequestException('Заполните список полученных товаров для смены статуса поставки.')
      }
    }

    if (previousStatus === 'получена' && newStatus === 'получена' && !updateData.received_amount?.length) {
      throw new BadRequestException('Для статуса "получена" укажите полученные товары')
    }

    const previousStock = existingArrival.stock
    await this.undoStocking(existingArrival)

    const updatedArrival = existingArrival.set(updateData)
    const newStock = updatedArrival.stock
    await this.doStocking(updatedArrival)

    await this.stockManipulationService.saveStock(previousStock)
    await this.stockManipulationService.saveStock(newStock)

    if (log) {
      updatedArrival.logs.push(log)
    }

    await updatedArrival.save()
    return await updatedArrival.populate('received_amount.product')
  }

  async archive(id: string, userId: mongoose.Types.ObjectId) {
    const arrival = await this.arrivalModel.findById(id)

    if (!arrival) throw new NotFoundException('Поставка не найдена.')

    if (arrival.isArchived) throw new ForbiddenException('Поставка уже в архиве.')

    if (arrival.arrival_status === 'ожидается доставка'  ) {
      throw new ForbiddenException('Поставку можно архивировать только после получения')
    }

    const hasUnpaidInvoice = await this.invoiceModel.exists({
      associatedArrival: id,
      status: { $in: ['в ожидании', 'частично оплачено'] },
    })

    if (hasUnpaidInvoice) {
      throw new ForbiddenException(
        'Поставка не может быть перемещена в архив, так как она не оплачена.',
      )
    }

    arrival.isArchived = true

    const log = this.logsService.generateLogForArchive(userId, arrival.isArchived)
    arrival.logs.push(log)

    await arrival.save()

    return { message: 'Поставка перемещена в архив.' }
  }

  async unarchive(id: string, userId: mongoose.Types.ObjectId) {
    const arrival = await this.arrivalModel.findById(id)

    if (!arrival) throw new NotFoundException('Поставка не найден')

    if (!arrival.isArchived) throw new ForbiddenException('Поставка не находится в архиве')

    arrival.isArchived = false

    const log = this.logsService.generateLogForArchive(userId, arrival.isArchived)
    arrival.logs.push(log)

    await arrival.save()

    return { message: 'Клиент восстановлен из архива' }
  }

  async cancel(id: string) {
    const arrival = await this.arrivalModel.findByIdAndDelete(id)

    if (!arrival) throw new NotFoundException('Поставка не найдена.')

    this.stockManipulationService.init()

    await this.undoStocking(arrival)

    await this.stockManipulationService.saveStock(arrival.stock)
    return { message: 'Поставка успешно отменена.' }
  }

  async delete(id: string) {
    const arrival = await this.arrivalModel.findById(id)

    if (!arrival) throw new NotFoundException('Поставка не найдена.')

    if (arrival.arrival_status === 'ожидается доставка'  ) {
      throw new ForbiddenException('Поставку можно удалить только после получения')
    }

    const hasUnpaidInvoice = await this.invoiceModel.exists({
      associatedArrival: id,
      status: { $in: ['в ожидании', 'частично оплачено'] },
    })

    if (hasUnpaidInvoice) {
      throw new ForbiddenException(
        'Поставка не может быть удалена, так как она не оплачена.',
      )
    }
    await arrival.deleteOne()
    return { message: 'Поставка удалена' }
  }
}

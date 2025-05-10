import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema'
import { CreateInvoiceDto, InvoiceServiceDto } from '../dto/create-invoice.dto'
import { UpdateInvoiceDto } from '../dto/update-invoice.dto'
import { CounterService } from './counter.service'
import { Service, ServiceDocument } from '../schemas/service.schema'
import mongoose, { Model } from 'mongoose'
import { LogsService } from './logs.service'
import { ValidationError } from 'class-validator'
import { DtoValidationError } from 'src/exception-filters/dto-validation-error.filter'

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    private readonly counterService: CounterService,
    private readonly logsService: LogsService,
  ) {}

  private async calculateTotalAmount(
    services: (InvoiceServiceDto & { type: 'внутренняя' | 'внешняя' })[],
    discount?: number,
  ) {
    return (
      await Promise.all(
        services.map(async x => {
          const service = await this.serviceModel.findById(x.service)

          return (
            x.service_amount *
            (x.service_price ?? service?.price ?? 0) *
            ((x.service_type ?? service?.type) === 'внутренняя' ? 1 - (discount ?? 0) / 100 : 1)
          )
        }),
      )
    ).reduce((a, x) => a + x, 0)
  }

  private determineStatus(
    paid_amount: number = 0,
    totalAmount: number,
  ): 'в ожидании' | 'оплачено' | 'частично оплачено' {
    if (paid_amount === 0) {
      return 'в ожидании'
    } else if (paid_amount === totalAmount) {
      return 'оплачено'
    } else {
      return 'частично оплачено'
    }
  }

  async getAll() {
    return this.invoiceModel.find({ isArchived: false }).populate('client services.service').sort({ createdAt: -1 })
  }

  async getOne(id: string) {
    const invoice = await this.invoiceModel
      .findById(id)
      .populate('client')
      .populate({
        path: 'services.service',
        populate: {
          path: 'serviceCategory',
          model: 'ServiceCategory',
        },
      })
      .populate({
        path: 'associatedArrivalServices.service',
        populate: {
          path: 'serviceCategory',
          model: 'ServiceCategory',
        },
      })
      .populate({
        path: 'associatedOrderServices.service',
        populate: {
          path: 'serviceCategory',
          model: 'ServiceCategory',
        },
      })
      .populate([
        {
          path: 'associatedOrder',
          select: 'orderNumber services',
          populate: {
            path: 'services.service',
          },
        },
        {
          path: 'associatedArrival',
          select: 'arrivalNumber services',
          populate: {
            path: 'services.service',
          },
        },
      ])
      .populate({ path: 'logs.user', select: '-password -token' })

    if (!invoice) throw new NotFoundException('Счёт не найден.')
    if (invoice.isArchived) throw new ForbiddenException('Счёт находится в архиве.')

    return invoice
  }

  async getArchived() {
    return this.invoiceModel.find({ isArchived: true }).populate('client services.service').sort({ createdAt: -1 })
  }

  async getArchivedOne(id: string, populate = false) {
    let invoice: InvoiceDocument | null

    if (populate) {
      invoice = await this.invoiceModel
        .findById(id)
        .populate('client')
        .populate({
          path: 'services.service',
          populate: {
            path: 'serviceCategory',
            model: 'ServiceCategory',
          },
        })
        .populate({
          path: 'associatedArrivalServices.service',
          populate: {
            path: 'serviceCategory',
            model: 'ServiceCategory',
          },
        })
        .populate({
          path: 'associatedOrderServices.service',
          populate: {
            path: 'serviceCategory',
            model: 'ServiceCategory',
          },
        })
        .populate([
          {
            path: 'associatedOrder',
            select: 'orderNumber services',
            populate: {
              path: 'services.service',
            },
          },
          {
            path: 'associatedArrival',
            select: 'arrivalNumber services',
            populate: {
              path: 'services.service',
            },
          },
        ])
        .populate({ path: 'logs.user', select: '-password -token' })
    } else {
      invoice = await this.invoiceModel.findById(id)
    }

    if (!invoice) throw new NotFoundException('Счёт не найден.')

    if (!invoice.isArchived) throw new ForbiddenException('Счёт не находится в архиве.')

    return invoice
  }

  validate(dto: Partial<CreateInvoiceDto>) {
    if (!dto.associatedArrival && !dto.associatedOrder) {
      const error = new ValidationError
      error.property = 'associatedArrival'
      error.constraints = { ArrivalOrOrder: 'Для счета необходимо указать либо поставку, либо заказ. Оба поля могут быть указаны одновременно.' }
      throw new DtoValidationError([error])
    }
  }

  async create(createInvoiceDto: CreateInvoiceDto, userId: mongoose.Types.ObjectId) {
    this.validate(createInvoiceDto)

    const sequenceNumber = await this.counterService.getNextSequence('invoice')
    const invoiceNumber = `INV-${ sequenceNumber }`

    const servicesToUse = ([] as InvoiceServiceDto[]).concat(
      createInvoiceDto.services ?? [],
      createInvoiceDto.associatedArrivalServices ?? [],
      createInvoiceDto.associatedOrderServices ?? [],
    )

    const populatedServices = await Promise.all(
      servicesToUse.map(async item => {
        const serviceDoc = await this.serviceModel.findById(item.service).lean()
        if (!serviceDoc) {
          throw new Error(`Услуга с ID  ${ item.service.toString() } не найдена`)
        }
        return {
          ...item,
          type: serviceDoc.type,
        }
      })
    )

    const totalAmount = await this.calculateTotalAmount(
      populatedServices,
      createInvoiceDto.discount,
    )

    const status = this.determineStatus(createInvoiceDto.paid_amount, totalAmount)

    const log = this.logsService.generateLogForCreate(userId)

    const newInvoice = new this.invoiceModel({
      ...createInvoiceDto,
      invoiceNumber,
      totalAmount: totalAmount,
      status: status,
      logs: [log],
    })

    return await newInvoice.save()
  }

  async update(id: string, updateDto: UpdateInvoiceDto, userId: mongoose.Types.ObjectId) {
    const existing = await this.invoiceModel.findById(id)

    if (!existing) throw new NotFoundException('Счёт не найден.')

    this.validate(updateDto)

    const servicesToUse = ([] as InvoiceServiceDto[]).concat(updateDto.services ?? [], updateDto.associatedArrivalServices ?? [], updateDto.associatedOrderServices ?? [])

    const populatedServices = await Promise.all(
      servicesToUse.map(async item => {
        const serviceDoc = await this.serviceModel.findById(item.service).lean()
        if (!serviceDoc) {
          throw new Error(`Услуга с ID ${ item.service.toString() } не найдена`)
        }
        return {
          ...item,
          type: serviceDoc.type,
        }
      })
    )

    const discountToUse = updateDto.discount ?? existing.discount

    const paid_amount = updateDto.paid_amount ?? existing.paid_amount

    const totalAmount = await this.calculateTotalAmount(
      populatedServices,
      discountToUse,
    )

    updateDto.totalAmount = totalAmount
    updateDto.status = this.determineStatus(paid_amount, totalAmount)

    const invoiceDtoObj = { ...updateDto }

    const log = this.logsService.trackChanges(
      existing.toObject(),
      invoiceDtoObj,
      userId,
    )

    return this.invoiceModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...updateDto,
            totalAmount,
          },
          $push: {
            logs: log,
          },
        },
        { new: true },
      )
      .populate('client services.service')
  }

  async archive(id: string, userId: mongoose.Types.ObjectId) {
    const invoice = await this.invoiceModel.findById(id)

    if (!invoice) throw new NotFoundException('Счёт не найден.')
    if (invoice.isArchived) throw new ForbiddenException('Счёт уже в архиве.')

    invoice.isArchived = true
    const log = this.logsService.generateLogForArchive(userId, invoice.isArchived)
    invoice.logs.push(log)

    await invoice.save()

    return { message: 'Счёт перемещён в архив.' }
  }

  async unarchive(id: string, userId: mongoose.Types.ObjectId) {
    const invoice = await this.invoiceModel.findById(id)

    if (!invoice) throw new NotFoundException('Счёт не найден')

    if (!invoice.isArchived) throw new ForbiddenException('Счёт не находится в архиве')

    invoice.isArchived = false
    const log = this.logsService.generateLogForArchive(userId, invoice.isArchived)
    invoice.logs.push(log)

    await invoice.save()

    return { message: 'Счёт восстановлен из архива' }
  }

  async delete(id: string) {
    const invoice = await this.invoiceModel.findByIdAndDelete(id)

    if (!invoice) throw new NotFoundException('Счёт не найден.')

    return { message: 'Счёт успешно удалён.' }
  }
}

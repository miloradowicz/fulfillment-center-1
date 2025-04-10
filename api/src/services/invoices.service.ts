import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema'
import { CreateInvoiceDto, InvoiceServiceDto } from '../dto/create-invoice.dto'
import { UpdateInvoiceDto } from '../dto/update-invoice.dto'
import { CounterService } from './counter.service'

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>,
    private readonly counterService: CounterService,
  ) {}

  private calculateTotalAmount(services: InvoiceServiceDto[]): number {
    return services.reduce((total, serviceData) => {
      const servicePrice = serviceData.service_price || 0
      return total + servicePrice * serviceData.service_amount
    }, 0)
  }

  async getAll() {
    return this.invoiceModel.find({ isArchived: false }).populate('client services.service').sort({ createdAt: -1 })
  }

  async getOne(id: string) {
    const invoice = await this.invoiceModel
      .findById(id)
      .populate('client services.service')
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
        .populate('services.service')
        .populate({ path: 'logs.user', select: '-password -token' })
    } else {
      invoice = await this.invoiceModel.findById(id)
    }

    if (!invoice) throw new NotFoundException('Счёт не найден.')

    if (!invoice.isArchived) throw new ForbiddenException('Счёт не находится в архиве.')

    return invoice
  }

  async create(createInvoiceDto: CreateInvoiceDto) {
    const sequenceNumber = await this.counterService.getNextSequence('invoice')
    const invoiceNumber = `INV-${ sequenceNumber }`

    const totalAmount = this.calculateTotalAmount(createInvoiceDto.services)

    const newInvoice = new this.invoiceModel({
      ...createInvoiceDto,
      invoiceNumber,
      totalAmount,
    })

    return await newInvoice.save()
  }

  async update(id: string, updateDto: UpdateInvoiceDto) {
    const existing = await this.invoiceModel.findById(id)

    if (!existing) throw new NotFoundException('Счёт не найден.')

    return this.invoiceModel.findByIdAndUpdate(id, updateDto, { new: true }).populate('client services.service')
  }

  async archive(id: string) {
    const invoice = await this.invoiceModel.findById(id)

    if (!invoice) throw new NotFoundException('Счёт не найден.')
    if (invoice.isArchived) throw new ForbiddenException('Счёт уже в архиве.')

    invoice.isArchived = true
    await invoice.save()

    return { message: 'Счёт перемещён в архив.' }
  }

  async delete(id: string) {
    const invoice = await this.invoiceModel.findByIdAndDelete(id)

    if (!invoice) throw new NotFoundException('Счёт не найден.')

    return { message: 'Счёт успешно удалён.' }
  }
}

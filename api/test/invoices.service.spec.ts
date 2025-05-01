/* eslint-disable */

import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Model } from 'mongoose'
import { InvoicesService } from '../src/services/invoices.service'
import { Invoice, InvoiceDocument } from '../src/schemas/invoice.schema'
import { Service, ServiceDocument } from '../src/schemas/service.schema'
import { CounterService } from '../src/services/counter.service'

describe('InvoicesService', () => {
  let service: InvoicesService
  let invoiceModel: Model<InvoiceDocument>
  let serviceModel: Model<ServiceDocument>
  let counterService: CounterService

  const mockInvoice = {
    _id: 'invoice-id-1',
    invoiceNumber: 'INV-1',
    client: 'client-id-1',
    services: [
      {
        service: 'service-id-1',
        service_price: 1000,
        service_amount: 2,
      },
    ],
    totalAmount: 2000,
    paid_amount: 0,
    discount: 0,
    status: 'в ожидании',
    isArchived: false,
    logs: [],
    save: jest.fn().mockResolvedValue(this),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
  }

  const mockArchivedInvoice = {
    ...mockInvoice,
    _id: 'invoice-id-2',
    isArchived: true,
  }

  const mockService = {
    _id: 'service-id-1',
    name: 'Test Service',
    type: 'внутренняя',
    price: 1000,
  }

  const mockInvoiceModel = {
    find: jest.fn(),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockInvoice),
    }),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  }

  const mockServiceModel = {
    findById: jest.fn(),
  }

  const mockCounterService = {
    getNextSequence: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
        {
          provide: getModelToken(Service.name),
          useValue: mockServiceModel,
        },
        {
          provide: CounterService,
          useValue: mockCounterService,
        },
      ],
    }).compile()

    service = module.get<InvoicesService>(InvoicesService)
    invoiceModel = module.get<Model<InvoiceDocument>>(getModelToken(Invoice.name))
    serviceModel = module.get<Model<ServiceDocument>>(getModelToken(Service.name))
    counterService = module.get<CounterService>(CounterService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAll', () => {
    it('should return all non-archived invoices', async () => {
      const invoices = [mockInvoice]
      jest.spyOn(mockInvoiceModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(invoices),
        }),
      } as any)

      const result = await service.getAll()
      expect(result).toEqual(invoices)
      expect(mockInvoiceModel.find).toHaveBeenCalledWith({ isArchived: false })
    })
  })

  describe('getOne', () => {
    it('should return an invoice by id', async () => {
      jest.spyOn(mockInvoiceModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                  populate: jest.fn().mockResolvedValue(mockInvoice),
                }),
              }),
            }),
          }),
        }),
      } as any);

      const result = await service.getOne('invoice-id-1')
      expect(result).toEqual(mockInvoice)
    })

    it('should throw NotFoundException if invoice not found', async () => {
      jest.spyOn(mockInvoiceModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                  populate: jest.fn().mockResolvedValue(null),
                }),
              }),
            }),
          }),
        }),
      } as any)

      await expect(service.getOne('non-existent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if invoice is archived', async () => {
      jest.spyOn(mockInvoiceModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                  populate: jest.fn().mockResolvedValue(mockArchivedInvoice),
                }),
              }),
            }),
          }),
        }),
      } as any)

      await expect(service.getOne('invoice-id-2')).rejects.toThrow(ForbiddenException)
    })
  })

  describe('getArchived', () => {
    it('should return all archived invoices', async () => {
      const invoices = [mockArchivedInvoice]
      jest.spyOn(mockInvoiceModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(invoices),
        }),
      } as any)

      const result = await service.getArchived()
      expect(result).toEqual(invoices)
      expect(mockInvoiceModel.find).toHaveBeenCalledWith({ isArchived: true })
    })
  })

  describe('getArchivedOne', () => {
    it('should return an archived invoice by id with populate=true', async () => {
      jest.spyOn(mockInvoiceModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                  populate: jest.fn().mockResolvedValue(mockArchivedInvoice),
                }),
              }),
            }),
          }),
        }),
      } as any)

      const result = await service.getArchivedOne('invoice-id-2', true)
      expect(result).toEqual(mockArchivedInvoice)
    })

    it('should return an archived invoice by id with populate=false', async () => {
      jest.spyOn(mockInvoiceModel, 'findById').mockResolvedValue(mockArchivedInvoice as any)

      const result = await service.getArchivedOne('invoice-id-2', false)
      expect(result).toEqual(mockArchivedInvoice)
    })

    it('should throw NotFoundException if invoice not found', async () => {
      jest.spyOn(mockInvoiceModel, 'findById').mockResolvedValue(null)

      await expect(service.getArchivedOne('non-existent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if invoice is not archived', async () => {
      jest.spyOn(mockInvoiceModel, 'findById').mockResolvedValue(mockInvoice as any)

      await expect(service.getArchivedOne('invoice-id-1')).rejects.toThrow(ForbiddenException)
    })
  })

  describe('create', () => {
    it('should have a create method', () => {
      expect(service.create).toBeDefined()
    })
  })

  describe('update', () => {
    it('should have an update method', () => {
      expect(service.update).toBeDefined()
    })

    it('should throw NotFoundException if invoice not found', async () => {
      jest.spyOn(mockInvoiceModel, 'findById').mockResolvedValue(null)

      await expect(service.update('non-existent-id', {})).rejects.toThrow(NotFoundException)
    })
  })

  describe('archive', () => {
    it('should archive an invoice', async () => {
      const saveSpy = jest.fn().mockResolvedValue({ ...mockInvoice, isArchived: true })

      jest.spyOn(mockInvoiceModel, 'findById').mockResolvedValue({
        ...mockInvoice,
        save: saveSpy,
      } as any)

      const result = await service.archive('invoice-id-1')
      expect(result).toEqual({ message: 'Счёт перемещён в архив.' })
      expect(saveSpy).toHaveBeenCalled()
    })

    it('should throw NotFoundException if invoice not found', async () => {
      jest.spyOn(mockInvoiceModel, 'findById').mockResolvedValue(null)

      await expect(service.archive('non-existent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if invoice is already archived', async () => {
      jest.spyOn(mockInvoiceModel, 'findById').mockResolvedValue(mockArchivedInvoice as any)

      await expect(service.archive('invoice-id-2')).rejects.toThrow(ForbiddenException)
    })
  })

  describe('delete', () => {
    it('should delete an invoice', async () => {
      jest.spyOn(mockInvoiceModel, 'findByIdAndDelete').mockResolvedValue(mockInvoice as any)

      const result = await service.delete('invoice-id-1')
      expect(result).toEqual({ message: 'Счёт успешно удалён.' })
    })

    it('should throw NotFoundException if invoice not found', async () => {
      jest.spyOn(mockInvoiceModel, 'findByIdAndDelete').mockResolvedValue(null)

      await expect(service.delete('non-existent-id')).rejects.toThrow(NotFoundException)
    })
  })
})

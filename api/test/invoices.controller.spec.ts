/**
 * Тесты для контроллера счетов
 *
 * ВАЖНО: В этих тестах мы мокаем RolesGuard, чтобы обойти проверку ролей.
 * Это позволяет нам тестировать логику контроллера без необходимости настраивать
 * полную аутентификацию и авторизацию.
 */

import { Test, TestingModule } from '@nestjs/testing'
import { InvoicesController } from '../src/controllers/invoices.controller'
import { InvoicesService } from '../src/services/invoices.service'
import { CreateInvoiceDto } from '../src/dto/create-invoice.dto'
import { UpdateInvoiceDto } from '../src/dto/update-invoice.dto'
import mongoose from 'mongoose'
import { RolesGuard } from '../src/guards/roles.guard'
import { TokenAuthService } from '../src/services/token-auth.service'
import { RolesService } from '../src/services/roles.service'
import { ForbiddenException, NotFoundException } from '@nestjs/common'

// Мокаем RolesGuard, чтобы он пропускал все запросы
jest.mock('../src/guards/roles.guard', () => ({
  RolesGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}))

describe('InvoicesController', () => {
  let controller: InvoicesController
  let service: InvoicesService

  const mockInvoice = {
    _id: 'invoice-id',
    invoiceNumber: 'INV-123',
    client: 'client-id',
    services: [
      {
        service: 'service-id',
        service_amount: 1,
        service_price: 100,
      },
    ],
    totalAmount: 100,
    paid_amount: 0,
    status: 'в ожидании',
    isArchived: false,
  }

  const mockInvoicesService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
    getArchived: jest.fn(),
    getArchivedOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    archive: jest.fn(),
    delete: jest.fn(),
  }

  const mockTokenAuthService = {
    validateToken: jest.fn().mockResolvedValue(true),
  }

  const mockRolesService = {
    checkRoles: jest.fn().mockReturnValue(true),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: mockInvoicesService,
        },
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: TokenAuthService,
          useValue: mockTokenAuthService,
        },
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<InvoicesController>(InvoicesController)
    service = module.get<InvoicesService>(InvoicesService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllInvoices', () => {
    it('should return all invoices', async () => {
      const invoices = [mockInvoice]
      mockInvoicesService.getAll.mockResolvedValue(invoices)

      const result = await controller.getAllInvoices()

      expect(service.getAll).toHaveBeenCalled()
      expect(result).toEqual(invoices)
    })
  })

  describe('getArchivedInvoices', () => {
    it('should return all archived invoices', async () => {
      const archivedInvoices = [{ ...mockInvoice, isArchived: true }]
      mockInvoicesService.getArchived.mockResolvedValue(archivedInvoices)

      const result = await controller.getArchivedInvoices()

      expect(service.getArchived).toHaveBeenCalled()
      expect(result).toEqual(archivedInvoices)
    })
  })

  describe('getOneInvoice', () => {
    it('should return an invoice by id', async () => {
      mockInvoicesService.getOne.mockResolvedValue(mockInvoice)

      const result = await controller.getOneInvoice('invoice-id')

      expect(service.getOne).toHaveBeenCalledWith('invoice-id')
      expect(result).toEqual(mockInvoice)
    })

    it('should throw NotFoundException when invoice not found', async () => {
      mockInvoicesService.getOne.mockRejectedValue(new NotFoundException('Счёт не найден.'))

      await expect(controller.getOneInvoice('nonexistent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException when invoice is archived', async () => {
      mockInvoicesService.getOne.mockRejectedValue(new ForbiddenException('Счёт находится в архиве.'))

      await expect(controller.getOneInvoice('archived-id')).rejects.toThrow(ForbiddenException)
    })
  })

  describe('getOneArchivedInvoice', () => {
    it('should return an archived invoice by id', async () => {
      const archivedInvoice = { ...mockInvoice, isArchived: true }
      mockInvoicesService.getArchivedOne.mockResolvedValue(archivedInvoice)

      const result = await controller.getOneArchivedInvoice('invoice-id', '1')

      expect(service.getArchivedOne).toHaveBeenCalledWith('invoice-id', true)
      expect(result).toEqual(archivedInvoice)
    })

    it('should throw NotFoundException when archived invoice not found', async () => {
      mockInvoicesService.getArchivedOne.mockRejectedValue(new NotFoundException('Счёт не найден.'))

      await expect(controller.getOneArchivedInvoice('nonexistent-id', '1')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException when invoice is not archived', async () => {
      mockInvoicesService.getArchivedOne.mockRejectedValue(new ForbiddenException('Счёт не находится в архиве.'))

      await expect(controller.getOneArchivedInvoice('non-archived-id', '1')).rejects.toThrow(ForbiddenException)
    })
  })

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        client: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
        services: [
          {
            service: new mongoose.Types.ObjectId('607f1f77bcf86cd799439022'),
            service_amount: 1,
            service_price: 100,
          },
        ],
        paid_amount: 0,
        totalAmount: 100,
      } as any

      mockInvoicesService.create.mockResolvedValue(mockInvoice)

      const result = await controller.createInvoice(createInvoiceDto)

      expect(service.create).toHaveBeenCalledWith(createInvoiceDto)
      expect(result).toEqual(mockInvoice)
    })
  })

  describe('updateInvoice', () => {
    it('should update an invoice successfully', async () => {
      const updateInvoiceDto: UpdateInvoiceDto = {
        paid_amount: 50,
      }

      const updatedInvoice = {
        ...mockInvoice,
        paid_amount: 50,
        status: 'частично оплачено',
      }

      mockInvoicesService.update.mockResolvedValue(updatedInvoice)

      const result = await controller.updateInvoice('invoice-id', updateInvoiceDto)

      expect(service.update).toHaveBeenCalledWith('invoice-id', updateInvoiceDto)
      expect(result).toEqual(updatedInvoice)
    })

    it('should throw NotFoundException when invoice not found', async () => {
      const updateInvoiceDto: UpdateInvoiceDto = {
        paid_amount: 50,
      }

      mockInvoicesService.update.mockRejectedValue(new NotFoundException('Счёт не найден.'))

      await expect(controller.updateInvoice('nonexistent-id', updateInvoiceDto)).rejects.toThrow(NotFoundException)
    })
  })

  describe('archiveInvoice', () => {
    it('should archive an invoice successfully', async () => {
      const archiveResult = { message: 'Счёт перемещён в архив.' }
      mockInvoicesService.archive.mockResolvedValue(archiveResult)

      const result = await controller.archiveInvoice('invoice-id')

      expect(service.archive).toHaveBeenCalledWith('invoice-id')
      expect(result).toEqual(archiveResult)
    })

    it('should throw NotFoundException when invoice not found', async () => {
      mockInvoicesService.archive.mockRejectedValue(new NotFoundException('Счёт не найден.'))

      await expect(controller.archiveInvoice('nonexistent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException when invoice already archived', async () => {
      mockInvoicesService.archive.mockRejectedValue(new ForbiddenException('Счёт уже в архиве.'))

      await expect(controller.archiveInvoice('already-archived-id')).rejects.toThrow(ForbiddenException)
    })
  })

  describe('deleteInvoice', () => {
    it('should delete an invoice successfully', async () => {
      const deleteResult = { message: 'Счёт успешно удалён.' }
      mockInvoicesService.delete.mockResolvedValue(deleteResult)

      const result = await controller.deleteInvoice('invoice-id')

      expect(service.delete).toHaveBeenCalledWith('invoice-id')
      expect(result).toEqual(deleteResult)
    })

    it('should throw NotFoundException when invoice not found', async () => {
      mockInvoicesService.delete.mockRejectedValue(new NotFoundException('Счёт не найден.'))

      await expect(controller.deleteInvoice('nonexistent-id')).rejects.toThrow(NotFoundException)
    })
  })
})

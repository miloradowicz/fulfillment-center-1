import { Test, TestingModule } from '@nestjs/testing'
import { CounterpartiesController } from '../src/controllers/counterparties.controller'
import { CounterpartiesService } from '../src/services/counterparties.service'
import { RolesGuard } from '../src/guards/roles.guard'
import { CreateCounterpartyDto } from '../src/dto/create-counterparty.dto'
import { UpdateCounterpartyDto } from '../src/dto/update-counterparty.dto'
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'

class MockCounterpartyDocument {
  _id: string;
  name: string;
  isArchived: boolean = false;
  phone_number?: string;
  address?: string;
  
  constructor(data: any = {}) {
    Object.assign(this, data)
  }
  
  set(data: any) {
    Object.assign(this, data)
    return this
  }
  
  save() {
    return Promise.resolve(this)
  }
  
  deleteOne() {
    return Promise.resolve({ deletedCount: 1 })
  }
}

describe('CounterpartiesController', () => {
  let controller: CounterpartiesController
  let service: CounterpartiesService

  // Мок для RolesGuard
  const mockRolesGuard = {
    canActivate: jest.fn().mockImplementation(() => true),
  }

  // Мок для CounterpartiesService
  const mockCounterpartiesService = {
    getAll: jest.fn(),
    getAllArchived: jest.fn(),
    getById: jest.fn(),
    getArchivedById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    archive: jest.fn(),
    unarchive: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounterpartiesController],
      providers: [
        {
          provide: CounterpartiesService,
          useValue: mockCounterpartiesService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile()

    controller = module.get<CounterpartiesController>(CounterpartiesController)
    service = module.get<CounterpartiesService>(CounterpartiesService)
    
    jest.clearAllMocks()
  })

  it('должен быть определен', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllCounterparties', () => {
    it('должен вызвать getAll из сервиса и вернуть контрагентов', async () => {
      const expectedCounterparties = [
        new MockCounterpartyDocument({ _id: 'counterparty1', name: 'Контрагент 1' }),
        new MockCounterpartyDocument({ _id: 'counterparty2', name: 'Контрагент 2' })
      ]
      
      mockCounterpartiesService.getAll.mockResolvedValue(expectedCounterparties)
      
      const result = await controller.getAllCounterparties()
      
      expect(service.getAll).toHaveBeenCalled()
      expect(result).toEqual(expectedCounterparties)
    })
  })

  describe('getAllArchivedCounterparties', () => {
    it('должен вызвать getAllArchived из сервиса и вернуть архивированных контрагентов', async () => {
      const expectedCounterparties = [
        new MockCounterpartyDocument({ _id: 'counterparty1', name: 'Контрагент 1', isArchived: true }),
        new MockCounterpartyDocument({ _id: 'counterparty2', name: 'Контрагент 2', isArchived: true })
      ]
      
      mockCounterpartiesService.getAllArchived.mockResolvedValue(expectedCounterparties)
      
      const result = await controller.getAllArchivedCounterparties()
      
      expect(service.getAllArchived).toHaveBeenCalled()
      expect(result).toEqual(expectedCounterparties)
    })
  })

  describe('getCounterpartyById', () => {
    it('должен вызвать getById из сервиса с правильным id и вернуть контрагента', async () => {
      const counterpartyId = 'counterparty-id'
      const expectedCounterparty = new MockCounterpartyDocument({ 
        _id: counterpartyId, 
        name: 'Тестовый контрагент',
        phone_number: '+7 (999) 123-45-67',
        address: 'ул. Тестовая, д. 1'
      })
      
      mockCounterpartiesService.getById.mockResolvedValue(expectedCounterparty)
      
      const result = await controller.getCounterpartyById(counterpartyId)
      
      expect(service.getById).toHaveBeenCalledWith(counterpartyId)
      expect(result).toEqual(expectedCounterparty)
    })
    
    it('должен выбросить NotFoundException, если контрагент не найден', async () => {
      const counterpartyId = 'non-existent-id'
      
      mockCounterpartiesService.getById.mockRejectedValue(new NotFoundException('Контрагент не найден'))
      
      await expect(controller.getCounterpartyById(counterpartyId))
        .rejects.toThrow(NotFoundException)
    })
    
    it('должен выбросить ForbiddenException, если контрагент в архиве', async () => {
      const counterpartyId = 'archived-counterparty-id'
      
      mockCounterpartiesService.getById.mockRejectedValue(new ForbiddenException('Контрагент в архиве'))
      
      await expect(controller.getCounterpartyById(counterpartyId))
        .rejects.toThrow(ForbiddenException)
    })
  })

  describe('getArchivedCounterparty', () => {
    it('должен вызвать getArchivedById из сервиса с правильным id и вернуть архивированного контрагента', async () => {
      const counterpartyId = 'archived-counterparty-id'
      const expectedCounterparty = new MockCounterpartyDocument({ 
        _id: counterpartyId, 
        name: 'Архивированный контрагент',
        isArchived: true
      })
      
      mockCounterpartiesService.getArchivedById.mockResolvedValue(expectedCounterparty)
      
      const result = await controller.getArchivedCounterparty(counterpartyId)
      
      expect(service.getArchivedById).toHaveBeenCalledWith(counterpartyId)
      expect(result).toEqual(expectedCounterparty)
    })
    
    it('должен выбросить NotFoundException, если контрагент не найден', async () => {
      const counterpartyId = 'non-existent-id'
      
      mockCounterpartiesService.getArchivedById.mockRejectedValue(new NotFoundException('Контрагент не найден'))
      
      await expect(controller.getArchivedCounterparty(counterpartyId))
        .rejects.toThrow(NotFoundException)
    })
    
    it('должен выбросить ForbiddenException, если контрагент не в архиве', async () => {
      const counterpartyId = 'active-counterparty-id'
      
      mockCounterpartiesService.getArchivedById.mockRejectedValue(new ForbiddenException('Этот контрагент не в архиве'))
      
      await expect(controller.getArchivedCounterparty(counterpartyId))
        .rejects.toThrow(ForbiddenException)
    })
  })

  describe('createCounterparty', () => {
    it('должен вызвать create из сервиса с правильными данными и вернуть результат', async () => {
      const createCounterpartyDto: CreateCounterpartyDto = {
        name: 'Новый контрагент',
        phone_number: '+7 (999) 123-45-67',
        address: 'ул. Примерная, д.1'
      }
      
      const expectedCounterparty = new MockCounterpartyDocument({
        _id: 'new-counterparty-id',
        name: 'Новый контрагент',
        phone_number: '+7 (999) 123-45-67',
        address: 'ул. Примерная, д.1'
      })
      
      mockCounterpartiesService.create.mockResolvedValue(expectedCounterparty)
      
      const result = await controller.createCounterparty(createCounterpartyDto)
      
      expect(service.create).toHaveBeenCalledWith(createCounterpartyDto)
      expect(result).toEqual(expectedCounterparty)
    })
    
    it('должен выбросить BadRequestException, если контрагент с таким именем уже существует', async () => {
      const createCounterpartyDto: CreateCounterpartyDto = {
        name: 'Существующий контрагент',
        phone_number: '+7 (999) 123-45-67',
        address: 'ул. Примерная, д.1'
      }
      
      mockCounterpartiesService.create.mockRejectedValue(
        new BadRequestException({
          message: 'Контрагент с таким именем уже существует',
          errors: { name: 'Имя должно быть уникальным' },
        })
      )
      
      await expect(controller.createCounterparty(createCounterpartyDto))
        .rejects.toThrow(BadRequestException)
    })
  })

  describe('updateCounterparty', () => {
    it('должен вызвать update из сервиса с правильными данными и вернуть обновленного контрагента', async () => {
      const counterpartyId = 'counterparty-id'
      const updateCounterpartyDto: UpdateCounterpartyDto = {
        name: 'Обновленный контрагент',
        address: 'Новый адрес'
      }
      
      const expectedCounterparty = new MockCounterpartyDocument({
        _id: counterpartyId,
        name: 'Обновленный контрагент',
        address: 'Новый адрес'
      })
      
      mockCounterpartiesService.update.mockResolvedValue(expectedCounterparty)
      
      const result = await controller.updateCounterparty(counterpartyId, updateCounterpartyDto)
      
      expect(service.update).toHaveBeenCalledWith(counterpartyId, updateCounterpartyDto)
      expect(result).toEqual(expectedCounterparty)
    })
    
    it('должен выбросить NotFoundException, если контрагент не найден', async () => {
      const counterpartyId = 'non-existent-id'
      const updateCounterpartyDto: UpdateCounterpartyDto = {
        name: 'Обновленный контрагент'
      }
      
      mockCounterpartiesService.update.mockRejectedValue(new NotFoundException('Контрагент не найден'))
      
      await expect(controller.updateCounterparty(counterpartyId, updateCounterpartyDto))
        .rejects.toThrow(NotFoundException)
    })
    
    it('должен выбросить BadRequestException, если контрагент с таким именем уже существует', async () => {
      const counterpartyId = 'counterparty-id'
      const updateCounterpartyDto: UpdateCounterpartyDto = {
        name: 'Существующий контрагент'
      }
      
      mockCounterpartiesService.update.mockRejectedValue(
        new BadRequestException({
          message: 'Контрагент с таким именем уже существует',
          errors: { name: 'Имя должно быть уникальным' },
        })
      )
      
      await expect(controller.updateCounterparty(counterpartyId, updateCounterpartyDto))
        .rejects.toThrow(BadRequestException)
    })
  })

  describe('archiveCounterparty', () => {
    it('должен вызвать archive из сервиса с правильным id и вернуть сообщение об успехе', async () => {
      const counterpartyId = 'counterparty-id'
      const expectedResponse = { message: 'Контрагент перемещен в архив' }
      
      mockCounterpartiesService.archive.mockResolvedValue(expectedResponse)
      
      const result = await controller.archiveCounterparty(counterpartyId)
      
      expect(service.archive).toHaveBeenCalledWith(counterpartyId)
      expect(result).toEqual(expectedResponse)
    })
    
    it('должен выбросить ForbiddenException, если контрагент уже в архиве', async () => {
      const counterpartyId = 'archived-counterparty-id'
      
      mockCounterpartiesService.archive.mockRejectedValue(new ForbiddenException('Контрагент уже в архиве'))
      
      await expect(controller.archiveCounterparty(counterpartyId))
        .rejects.toThrow(ForbiddenException)
    })
    
    it('должен выбросить NotFoundException, если контрагент не найден', async () => {
      const counterpartyId = 'non-existent-id'
      
      mockCounterpartiesService.archive.mockRejectedValue(new NotFoundException('Контрагент не найден'))
      
      await expect(controller.archiveCounterparty(counterpartyId))
        .rejects.toThrow(NotFoundException)
    })
  })

  describe('unarchiveClient', () => {
    it('должен вызвать unarchive из сервиса с правильным id и вернуть сообщение об успехе', async () => {
      const counterpartyId = 'archived-counterparty-id'
      const expectedResponse = { message: 'Контрагент восстановлен из архива' }
      
      mockCounterpartiesService.unarchive.mockResolvedValue(expectedResponse)
      
      const result = await controller.unarchiveClient(counterpartyId)
      
      expect(service.unarchive).toHaveBeenCalledWith(counterpartyId)
      expect(result).toEqual(expectedResponse)
    })
    
    it('должен выбросить ForbiddenException, если контрагент не в архиве', async () => {
      const counterpartyId = 'active-counterparty-id'
      
      mockCounterpartiesService.unarchive.mockRejectedValue(new ForbiddenException('Контрагент не находится в архиве'))
      
      await expect(controller.unarchiveClient(counterpartyId))
        .rejects.toThrow(ForbiddenException)
    })
    
    it('должен выбросить NotFoundException, если контрагент не найден', async () => {
      const counterpartyId = 'non-existent-id'
      
      mockCounterpartiesService.unarchive.mockRejectedValue(new NotFoundException('Контрагент не найден'))
      
      await expect(controller.unarchiveClient(counterpartyId))
        .rejects.toThrow(NotFoundException)
    })
  })

  describe('deleteCounterparty', () => {
    it('должен вызвать delete из сервиса с правильным id и вернуть сообщение об успехе', async () => {
      const counterpartyId = 'counterparty-id'
      const expectedResponse = { message: 'Контрагент успешно удалён' }
      
      mockCounterpartiesService.delete.mockResolvedValue(expectedResponse)
      
      const result = await controller.deleteCounterparty(counterpartyId)
      
      expect(service.delete).toHaveBeenCalledWith(counterpartyId)
      expect(result).toEqual(expectedResponse)
    })
    
    it('должен выбросить NotFoundException, если контрагент не найден', async () => {
      const counterpartyId = 'non-existent-id'
      
      mockCounterpartiesService.delete.mockRejectedValue(new NotFoundException('Контрагент не найден'))
      
      await expect(controller.deleteCounterparty(counterpartyId))
        .rejects.toThrow(NotFoundException)
    })
  })
}) 
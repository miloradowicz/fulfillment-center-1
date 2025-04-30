import { Test, TestingModule } from '@nestjs/testing'
import { ClientsController } from '../src/controllers/clients.controller'
import { ClientsService } from '../src/services/clients.service'
import { RolesGuard } from '../src/guards/roles.guard'
import { CreateClientDto } from '../src/dto/create-client.dto'
import { UpdateClientDto } from '../src/dto/update-client.dto'
import { NotFoundException, ForbiddenException } from '@nestjs/common'

class MockClientDocument {
  _id: string;
  name: string;
  isArchived: boolean = false;
  
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

describe('ClientsController', () => {
  let controller: ClientsController
  let service: ClientsService

  // Мок для RolesGuard
  const mockRolesGuard = {
    canActivate: jest.fn().mockImplementation(() => true),
  }

  // Мок для ClientsService
  const mockClientsService = {
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
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile()

    controller = module.get<ClientsController>(ClientsController)
    service = module.get<ClientsService>(ClientsService)
    
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllClients', () => {
    it('должен вызвать getAll из сервиса и вернуть клиентов', async () => {
      const expectedClients = [
        new MockClientDocument({ _id: 'client1', name: 'Клиент 1' }),
        new MockClientDocument({ _id: 'client2', name: 'Клиент 2' })
      ]
      
      mockClientsService.getAll.mockResolvedValue(expectedClients)
      
      const result = await controller.getAllClients()
      
      expect(service.getAll).toHaveBeenCalled()
      expect(result).toEqual(expectedClients)
    })
  })

  describe('getAllArchivedClients', () => {
    it('должен вызвать getAllArchived из сервиса и вернуть архивированных клиентов', async () => {
      const expectedClients = [
        new MockClientDocument({ _id: 'client1', name: 'Клиент 1', isArchived: true }),
        new MockClientDocument({ _id: 'client2', name: 'Клиент 2', isArchived: true })
      ]
      
      mockClientsService.getAllArchived.mockResolvedValue(expectedClients)
      
      const result = await controller.getAllArchivedClients()
      
      expect(service.getAllArchived).toHaveBeenCalled()
      expect(result).toEqual(expectedClients)
    })
  })

  describe('createClient', () => {
    it('должен вызвать create из сервиса с правильными данными и вернуть результат', async () => {
      const createClientDto: CreateClientDto = {
        name: 'Новый клиент',
        phone_number: '+7 (999) 123-45-67',
        email: 'client@example.com',
        inn: '1234567890',
        address: 'ул. Примерная, д.1',
        banking_data: 'Банк "Пример", Р/С 40700000000000000001',
        ogrn: '1234567890123'
      }
      
      const expectedClient = new MockClientDocument({
        _id: 'new-client-id',
        name: 'Новый клиент',
        phone_number: '+7 (999) 123-45-67',
        email: 'client@example.com',
        inn: '1234567890'
      })
      
      mockClientsService.create.mockResolvedValue(expectedClient)
      
      const result = await controller.createClient(createClientDto)
      
      expect(service.create).toHaveBeenCalledWith(createClientDto)
      expect(result).toEqual(expectedClient)
    })
  })

  describe('updateClient', () => {
    it('должен вызвать update из сервиса с правильными данными и вернуть обновленного клиента', async () => {
      const clientId = 'client-id'
      const updateClientDto: UpdateClientDto = {
        name: 'Обновленный клиент'
      }
      
      const expectedClient = new MockClientDocument({
        _id: clientId,
        name: 'Обновленный клиент'
      })
      
      mockClientsService.update.mockResolvedValue(expectedClient)
      
      const result = await controller.updateClient(clientId, updateClientDto)
      
      expect(service.update).toHaveBeenCalledWith(clientId, updateClientDto)
      expect(result).toEqual(expectedClient)
    })
    
    it('должен выбросить NotFoundException, если клиент не найден', async () => {
      const clientId = 'non-existent-id'
      const updateClientDto: UpdateClientDto = {
        name: 'Обновленный клиент'
      }
      
      mockClientsService.update.mockRejectedValue(new NotFoundException('Клиент не найден'))
      
      await expect(controller.updateClient(clientId, updateClientDto))
        .rejects.toThrow(NotFoundException)
    })
  })

  describe('archiveClient', () => {
    it('должен вызвать archive из сервиса с правильным id и вернуть сообщение об успехе', async () => {
      const clientId = 'client-id'
      const expectedResponse = { message: 'Клиент перемещен в архив' }
      
      mockClientsService.archive.mockResolvedValue(expectedResponse)
      
      const result = await controller.archiveClient(clientId)
      
      expect(service.archive).toHaveBeenCalledWith(clientId)
      expect(result).toEqual(expectedResponse)
    })
    
    it('должен выбросить ForbiddenException, если клиент уже в архиве', async () => {
      const clientId = 'archived-client-id'
      
      mockClientsService.archive.mockRejectedValue(new ForbiddenException('Клиент уже в архиве'))
      
      await expect(controller.archiveClient(clientId))
        .rejects.toThrow(ForbiddenException)
    })
    
    it('должен выбросить NotFoundException, если клиент не найден', async () => {
      const clientId = 'non-existent-id'
      
      mockClientsService.archive.mockRejectedValue(new NotFoundException('Клиент не найден'))
      
      await expect(controller.archiveClient(clientId))
        .rejects.toThrow(NotFoundException)
    })
  })

  describe('unarchiveClient', () => {
    it('должен вызвать unarchive из сервиса с правильным id и вернуть сообщение об успехе', async () => {
      const clientId = 'archived-client-id'
      const expectedResponse = { message: 'Клиент восстановлен из архива' }
      
      mockClientsService.unarchive.mockResolvedValue(expectedResponse)
      
      const result = await controller.unarchiveClient(clientId)
      
      expect(service.unarchive).toHaveBeenCalledWith(clientId)
      expect(result).toEqual(expectedResponse)
    })
    
    it('должен выбросить ForbiddenException, если клиент не в архиве', async () => {
      const clientId = 'active-client-id'
      
      mockClientsService.unarchive.mockRejectedValue(new ForbiddenException('Клиент не находится в архиве'))
      
      await expect(controller.unarchiveClient(clientId))
        .rejects.toThrow(ForbiddenException)
    })
    
    it('должен выбросить NotFoundException, если клиент не найден', async () => {
      const clientId = 'non-existent-id'
      
      mockClientsService.unarchive.mockRejectedValue(new NotFoundException('Клиент не найден'))
      
      await expect(controller.unarchiveClient(clientId))
        .rejects.toThrow(NotFoundException)
    })
  })

  describe('deleteClient', () => {
    it('должен вызвать delete из сервиса с правильным id и вернуть сообщение об успехе', async () => {
      const clientId = 'client-id'
      const expectedResponse = { message: 'Клиент успешно удалён' }
      
      mockClientsService.delete.mockResolvedValue(expectedResponse)
      
      const result = await controller.deleteClient(clientId)
      
      expect(service.delete).toHaveBeenCalledWith(clientId)
      expect(result).toEqual(expectedResponse)
    })
    
    it('должен выбросить ForbiddenException, если клиент заблокирован', async () => {
      const clientId = 'locked-client-id'
      
      mockClientsService.delete.mockRejectedValue(
        new ForbiddenException('Клиент не может быть удален, поскольку его товары уже используются в поставках и/или заказах.')
      )
      
      await expect(controller.deleteClient(clientId))
        .rejects.toThrow(ForbiddenException)
    })
    
    it('должен выбросить NotFoundException, если клиент не найден', async () => {
      const clientId = 'non-existent-id'
      
      mockClientsService.delete.mockRejectedValue(new NotFoundException('Клиент не найден'))
      
      await expect(controller.deleteClient(clientId))
        .rejects.toThrow(NotFoundException)
    })
  })
}) 
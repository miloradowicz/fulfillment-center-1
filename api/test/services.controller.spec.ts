import { Test, TestingModule } from '@nestjs/testing'
import { ServicesController } from '../src/controllers/services.controller'
import { ServicesService } from '../src/services/services.service'
import { CreateServiceDto } from '../src/dto/create-service.dto'
import { UpdateServiceDto } from '../src/dto/update-service.dto'
import mongoose from 'mongoose'
import { RolesGuard } from '../src/guards/roles.guard'

describe('ServicesController', () => {
  let controller: ServicesController
  let service: ServicesService

  const mockService = {
    getAll: jest.fn(),
    getAllByName: jest.fn(),
    getAllArchived: jest.fn(),
    getById: jest.fn(),
    getArchivedById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    archive: jest.fn(),
    delete: jest.fn(),
  }

  // Мок для RolesGuard
  const mockRolesGuard = {
    canActivate: jest.fn().mockImplementation(() => true),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile()

    controller = module.get<ServicesController>(ServicesController)
    service = module.get<ServicesService>(ServicesService)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllServices', () => {
    it('should get all services when no name provided', async () => {
      const result = [{ name: 'Test Service' }]
      mockService.getAll.mockResolvedValue(result)

      expect(await controller.getAllServices()).toEqual(result)
      expect(mockService.getAll).toHaveBeenCalled()
      expect(mockService.getAllByName).not.toHaveBeenCalled()
    })

    it('should get services by name when name provided', async () => {
      const result = [{ name: 'Test Service' }]
      const name = 'Test'
      mockService.getAllByName.mockResolvedValue(result)

      expect(await controller.getAllServices(name)).toEqual(result)
      expect(mockService.getAllByName).toHaveBeenCalledWith(name)
      expect(mockService.getAll).not.toHaveBeenCalled()
    })
  })

  describe('getAllArchivedServices', () => {
    it('should get all archived services', async () => {
      const result = [{ name: 'Archived Service', isArchived: true }]
      mockService.getAllArchived.mockResolvedValue(result)

      expect(await controller.getAllArchivedServices()).toEqual(result)
      expect(mockService.getAllArchived).toHaveBeenCalled()
    })
  })

  describe('getServiceById', () => {
    it('should get service by id', async () => {
      const result = { name: 'Test Service', id: '123' }
      const id = '123'
      mockService.getById.mockResolvedValue(result)

      expect(await controller.getServiceById(id)).toEqual(result)
      expect(mockService.getById).toHaveBeenCalledWith(id)
    })
  })

  describe('getArchivedServiceById', () => {
    it('should get archived service by id', async () => {
      const result = { name: 'Archived Service', id: '123', isArchived: true }
      const id = '123'
      mockService.getArchivedById.mockResolvedValue(result)

      expect(await controller.getArchivedServiceById(id)).toEqual(result)
      expect(mockService.getArchivedById).toHaveBeenCalledWith(id)
    })
  })

  describe('createService', () => {
    it('should create a service', async () => {
      const dto: CreateServiceDto = {
        name: 'New Service',
        serviceCategory: new mongoose.Types.ObjectId(),
        price: 100,
        description: 'Service description',
        type: 'внутренняя'
      }
      const result = { ...dto, id: '123' }
      mockService.create.mockResolvedValue(result)

      expect(await controller.createService(dto)).toEqual(result)
      expect(mockService.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('updateService', () => {
    it('should update a service', async () => {
      const id = '123'
      const dto: UpdateServiceDto = {
        name: 'Updated Service',
        price: 150
      }
      const result = { id, name: 'Updated Service', price: 150 }
      mockService.update.mockResolvedValue(result)

      expect(await controller.updateService(id, dto)).toEqual(result)
      expect(mockService.update).toHaveBeenCalledWith(id, dto)
    })
  })

  describe('archiveService', () => {
    it('should archive a service', async () => {
      const id = '123'
      const result = { message: 'Услуга перемещена в архив' }
      mockService.archive.mockResolvedValue(result)

      expect(await controller.archiveService(id)).toEqual(result)
      expect(mockService.archive).toHaveBeenCalledWith(id)
    })
  })

  describe('deleteService', () => {
    it('should delete a service', async () => {
      const id = '123'
      const result = { message: 'Услуга успешно удалёна' }
      mockService.delete.mockResolvedValue(result)

      expect(await controller.deleteService(id)).toEqual(result)
      expect(mockService.delete).toHaveBeenCalledWith(id)
    })
  })
}) 
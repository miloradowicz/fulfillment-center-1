/* eslint-disable */

import { Test, TestingModule } from '@nestjs/testing'
import { ServicesService } from '../src/services/services.service'
import { getModelToken } from '@nestjs/mongoose'
import { Service } from '../src/schemas/service.schema'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import mongoose from 'mongoose'

describe('ServicesService', () => {
  let service: ServicesService
  let mockServiceModel: any

  const mockService = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Тестовая услуга',
    serviceCategory: new mongoose.Types.ObjectId(),
    price: 100,
    description: 'Описание тестовой услуги',
    type: 'внутренняя',
    isArchived: false,
    populate: jest.fn().mockImplementation(function () {
      return this
    }),
    save: jest.fn().mockImplementation(function () {
      return this
    }),
    set: jest.fn().mockImplementation(function (data) {
      Object.assign(this, data)
      return this
    }),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    mockServiceModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndDelete: jest.fn(),
      create: jest.fn(),
      exec: jest.fn(),
    }

    mockServiceModel.find.mockReturnValue({
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getModelToken(Service.name),
          useValue: mockServiceModel,
        },
      ],
    }).compile()

    service = module.get<ServicesService>(ServicesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAll', () => {
    it('should return all non-archived services', async () => {
      const services = [mockService]
      mockServiceModel.find().populate().exec.mockResolvedValue(services)

      const result = await service.getAll()

      expect(result).toEqual(services)
      expect(mockServiceModel.find).toHaveBeenCalledWith({ isArchived: false })
      expect(mockServiceModel.find().populate).toHaveBeenCalledWith('serviceCategory')
      expect(mockServiceModel.find().populate().exec).toHaveBeenCalled()
    })
  })

  describe('getAllArchived', () => {
    it('should return all archived services', async () => {
      const services = [{ ...mockService, isArchived: true }]
      mockServiceModel.find().populate().exec.mockResolvedValue(services)

      const result = await service.getAllArchived()

      expect(result).toEqual(services)
      expect(mockServiceModel.find).toHaveBeenCalledWith({ isArchived: true })
      expect(mockServiceModel.find().populate).toHaveBeenCalledWith('serviceCategory')
      expect(mockServiceModel.find().populate().exec).toHaveBeenCalled()
    })
  })

  describe('getAllByName', () => {
    it('should return all non-archived services filtered by name', async () => {
      const name = 'Тест'
      const services = [mockService]
      mockServiceModel.find().find().populate().exec.mockResolvedValue(services)

      const result = await service.getAllByName(name)

      expect(result).toEqual(services)
      expect(mockServiceModel.find).toHaveBeenCalledWith({ isArchived: false })
      expect(mockServiceModel.find().find).toHaveBeenCalledWith({ name: { $regex: name, $options: 'i' } })
      expect(mockServiceModel.find().find().populate).toHaveBeenCalledWith('serviceCategory')
      expect(mockServiceModel.find().find().populate().exec).toHaveBeenCalled()
    })
  })

  describe('getAllArchivedByName', () => {
    it('should return all archived services filtered by name', async () => {
      const name = 'Тест'
      const services = [{ ...mockService, isArchived: true }]
      mockServiceModel.find().find().populate().exec.mockResolvedValue(services)

      const result = await service.getAllArchivedByName(name)

      expect(result).toEqual(services)
      expect(mockServiceModel.find).toHaveBeenCalledWith({ isArchived: true })
      expect(mockServiceModel.find().find).toHaveBeenCalledWith({ name: { $regex: name, $options: 'i' } })
      expect(mockServiceModel.find().find().populate).toHaveBeenCalledWith('serviceCategory')
      expect(mockServiceModel.find().find().populate().exec).toHaveBeenCalled()
    })
  })

  describe('getById', () => {
    it('should return a service by id', async () => {
      mockServiceModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockService),
        }),
      })

      const result = await service.getById(mockService._id.toString())

      expect(result).toEqual(mockService)
      expect(mockServiceModel.findById).toHaveBeenCalledWith(mockService._id.toString())
    })

    it('should throw NotFoundException if service is not found', async () => {
      mockServiceModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      })

      await expect(service.getById('nonexistentid')).rejects.toThrow(NotFoundException)
      expect(mockServiceModel.findById).toHaveBeenCalledWith('nonexistentid')
    })

    it('should throw ForbiddenException if service is archived', async () => {
      const archivedService = { ...mockService, isArchived: true }
      mockServiceModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(archivedService),
        }),
      })

      await expect(service.getById(mockService._id.toString())).rejects.toThrow(ForbiddenException)
      expect(mockServiceModel.findById).toHaveBeenCalledWith(mockService._id.toString())
    })
  })

  describe('getArchivedById', () => {
    it('should return an archived service by id', async () => {
      const archivedService = { ...mockService, isArchived: true }
      mockServiceModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(archivedService),
        }),
      })

      const result = await service.getArchivedById(mockService._id.toString())

      expect(result).toEqual(archivedService)
      expect(mockServiceModel.findById).toHaveBeenCalledWith(mockService._id.toString())
    })

    it('should throw NotFoundException if service is not found', async () => {
      mockServiceModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      })

      await expect(service.getArchivedById('nonexistentid')).rejects.toThrow(NotFoundException)
      expect(mockServiceModel.findById).toHaveBeenCalledWith('nonexistentid')
    })

    it('should throw ForbiddenException if service is not archived', async () => {
      mockServiceModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockService),
        }),
      })

      await expect(service.getArchivedById(mockService._id.toString())).rejects.toThrow(ForbiddenException)
      expect(mockServiceModel.findById).toHaveBeenCalledWith(mockService._id.toString())
    })
  })

  describe('create', () => {
    it('should create a new service', async () => {
      const serviceDto = {
        name: 'Новая услуга',
        serviceCategory: new mongoose.Types.ObjectId(),
        price: 200,
        description: 'Описание новой услуги',
        type: 'внешняя',
      }
      const createdService = { ...serviceDto, _id: new mongoose.Types.ObjectId() }

      mockServiceModel.create.mockReturnValue({
        populate: jest.fn().mockResolvedValue(createdService),
      })

      const result = await service.create(serviceDto as any)

      expect(result).toEqual(createdService)
      expect(mockServiceModel.create).toHaveBeenCalledWith(serviceDto)
    })
  })

  describe('update', () => {
    it('should update a service', async () => {
      const updateDto = {
        name: 'Обновленная услуга',
        price: 300,
      }

      mockServiceModel.findById.mockResolvedValue({
        ...mockService,
        set: mockService.set,
        save: mockService.save,
        populate: mockService.populate,
      })

      const result = await service.update(mockService._id.toString(), updateDto as any)

      expect(mockServiceModel.findById).toHaveBeenCalledWith(mockService._id.toString())
      expect(mockService.set).toHaveBeenCalledWith(updateDto)
      expect(mockService.save).toHaveBeenCalled()
      expect(mockService.populate).toHaveBeenCalledWith('serviceCategory')
    })

    it('should throw NotFoundException if service is not found', async () => {
      mockServiceModel.findById.mockResolvedValue(null)

      await expect(service.update('nonexistentid', {})).rejects.toThrow(NotFoundException)
      expect(mockServiceModel.findById).toHaveBeenCalledWith('nonexistentid')
    })

    it('should throw ForbiddenException if service is archived and force is false', async () => {
      const archivedService = {
        ...mockService,
        isArchived: true,
        set: mockService.set,
        save: mockService.save,
        populate: mockService.populate,
      }

      mockServiceModel.findById.mockResolvedValue(archivedService)

      await expect(service.update(mockService._id.toString(), {})).rejects.toThrow(ForbiddenException)
      expect(mockServiceModel.findById).toHaveBeenCalledWith(mockService._id.toString())
    })

    it('should update an archived service if force is true', async () => {
      const updateDto = {
        name: 'Обновленная услуга',
        price: 300,
      }

      const archivedService = {
        ...mockService,
        isArchived: true,
        set: mockService.set,
        save: mockService.save,
        populate: mockService.populate,
      }

      mockServiceModel.findById.mockResolvedValue(archivedService)

      const result = await service.update(mockService._id.toString(), updateDto as any, true)

      expect(mockServiceModel.findById).toHaveBeenCalledWith(mockService._id.toString())
      expect(mockService.set).toHaveBeenCalledWith(updateDto)
      expect(mockService.save).toHaveBeenCalled()
      expect(mockService.populate).toHaveBeenCalledWith('serviceCategory')
    })
  })

  describe('isLocked', () => {
    it('should return true if service exists', async () => {
      mockServiceModel.findById.mockResolvedValue(mockService)

      const result = await service.isLocked(mockService._id.toString())

      expect(result).toBe(true)
      expect(mockServiceModel.findById).toHaveBeenCalledWith(mockService._id.toString())
    })

    it('should throw NotFoundException if service is not found', async () => {
      mockServiceModel.findById.mockResolvedValue(null)

      await expect(service.isLocked('nonexistentid')).rejects.toThrow(NotFoundException)
      expect(mockServiceModel.findById).toHaveBeenCalledWith('nonexistentid')
    })
  })

  describe('archive', () => {
    it('should archive a service', async () => {
      mockServiceModel.findById.mockResolvedValue({
        ...mockService,
        isArchived: false,
        save: mockService.save,
      })

      const result = await service.archive(mockService._id.toString())

      expect(result).toEqual({ message: 'Услуга перемещена в архив' })
      expect(mockServiceModel.findById).toHaveBeenCalledWith(mockService._id.toString())
      expect(mockService.save).toHaveBeenCalled()
    })

    it('should throw NotFoundException if service is not found', async () => {
      mockServiceModel.findById.mockResolvedValue(null)

      await expect(service.archive('nonexistentid')).rejects.toThrow(NotFoundException)
      expect(mockServiceModel.findById).toHaveBeenCalledWith('nonexistentid')
    })

    it('should throw ForbiddenException if service is already archived', async () => {
      mockServiceModel.findById.mockResolvedValue({
        ...mockService,
        isArchived: true,
      })

      await expect(service.archive(mockService._id.toString())).rejects.toThrow(ForbiddenException)
      expect(mockServiceModel.findById).toHaveBeenCalledWith(mockService._id.toString())
    })
  })

  describe('delete', () => {
    it('should delete a service', async () => {
      mockServiceModel.findByIdAndDelete.mockResolvedValue(mockService)

      const result = await service.delete(mockService._id.toString())

      expect(result).toEqual({ message: 'Услуга успешно удалёна' })
      expect(mockServiceModel.findByIdAndDelete).toHaveBeenCalledWith(mockService._id.toString())
    })

    it('should throw NotFoundException if service is not found', async () => {
      mockServiceModel.findByIdAndDelete.mockResolvedValue(null)

      await expect(service.delete('nonexistentid')).rejects.toThrow(NotFoundException)
      expect(mockServiceModel.findByIdAndDelete).toHaveBeenCalledWith('nonexistentid')
    })
  })
})

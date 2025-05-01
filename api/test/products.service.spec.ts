/* eslint-disable */

import { Test, TestingModule } from '@nestjs/testing'
import { ProductsService } from '../src/services/products.service'
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Product, ProductDocument } from '../src/schemas/product.schema'
import { Arrival } from '../src/schemas/arrival.schema'
import { Order } from '../src/schemas/order.schema'
import * as mongoose from 'mongoose'
import { Model } from 'mongoose'
import { CreateProductDto } from '../src/dto/create-product.dto'
import { UpdateProductDto } from '../src/dto/update-product.dto'

describe('ProductsService', () => {
  let service: ProductsService
  let productModel: Model<ProductDocument>
  let arrivalModel: Model<any>
  let orderModel: Model<any>

  const mockProduct = {
    _id: new mongoose.Types.ObjectId().toString(),
    isArchived: false,
    client: new mongoose.Types.ObjectId(),
    title: 'Test Product',
    barcode: '1234567890123',
    article: 'TP-001',
    dynamic_fields: [{ key: 'color', label: 'Цвет', value: 'красный' }],
    logs: [],
    populate: jest.fn().mockImplementation(function () {
      return this
    }),
    exec: jest.fn().mockReturnThis(),
    save: jest.fn().mockResolvedValue(this),
  }

  const mockArchivedProduct = {
    ...mockProduct,
    isArchived: true,
  }

  const mockProductArray = [
    { ...mockProduct },
    {
      ...mockProduct,
      _id: new mongoose.Types.ObjectId().toString(),
      title: 'Test Product 2',
    },
  ]

  // Вспомогательные моки для nested queries
  const mockFindQuery = {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockProductArray),
    reverse: jest.fn().mockReturnValue(mockProductArray),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            find: jest.fn().mockImplementation(() => mockFindQuery),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockProduct),
            findByIdAndDelete: jest.fn().mockResolvedValue(mockProduct),
            create: jest.fn().mockResolvedValue(mockProduct),
          },
        },
        {
          provide: getModelToken(Arrival.name),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: getModelToken(Order.name),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
    productModel = module.get<Model<ProductDocument>>(getModelToken(Product.name))
    arrivalModel = module.get<Model<any>>(getModelToken(Arrival.name))
    orderModel = module.get<Model<any>>(getModelToken(Order.name))

    // Сбросим моки перед каждым тестом
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getById', () => {
    it('should return a product without populating', async () => {
      jest.spyOn(productModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      } as any)

      const result = await service.getById(mockProduct._id, false)

      expect(productModel.findById).toHaveBeenCalledWith(mockProduct._id)
      expect(result).toEqual(mockProduct)
    })

    it('should return a product with populating', async () => {
      jest.spyOn(productModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProduct),
      } as any)

      const result = await service.getById(mockProduct._id, true)

      expect(productModel.findById).toHaveBeenCalledWith(mockProduct._id)
      expect(result).toEqual(mockProduct)
    })

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(productModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      } as any)

      await expect(service.getById('nonexistent-id', false)).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if product is archived', async () => {
      jest.spyOn(productModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockArchivedProduct),
      } as any)

      await expect(service.getById(mockArchivedProduct._id, false)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('getAllByClient', () => {
    it('should return all unarchived products for a client without populating', async () => {
      const clientId = new mongoose.Types.ObjectId().toString()

      const result = await service.getAllByClient(clientId, false)

      expect(mockFindQuery.find).toHaveBeenCalledWith({ client: clientId })
      expect(result).toEqual(mockProductArray)
    })

    it('should return all unarchived products for a client with populating', async () => {
      const clientId = new mongoose.Types.ObjectId().toString()

      const result = await service.getAllByClient(clientId, true)

      expect(mockFindQuery.find).toHaveBeenCalledWith({ client: clientId })
      expect(mockFindQuery.populate).toHaveBeenCalledWith('client')
      expect(result).toEqual(mockProductArray)
    })
  })

  describe('getAll', () => {
    it('should return all unarchived products without populating', async () => {
      const result = await service.getAll(false)

      expect(result).toEqual(mockProductArray)
    })

    it('should return all unarchived products with populating', async () => {
      const result = await service.getAll(true)

      expect(mockFindQuery.populate).toHaveBeenCalledWith('client')
      expect(result).toEqual(mockProductArray)
    })
  })

  describe('getAllArchived', () => {
    it('should return all archived products without populating', async () => {
      await service.getAllArchived(false)

      expect(productModel.find).toHaveBeenCalledWith({ isArchived: true })
    })

    it('should return all archived products with populating', async () => {
      await service.getAllArchived(true)

      expect(productModel.find).toHaveBeenCalledWith({ isArchived: true })
      expect(mockFindQuery.populate).toHaveBeenCalledWith({
        path: 'client',
        select: 'name',
      })
    })
  })

  describe('getArchivedById', () => {
    it('should return archived product without populating', async () => {
      jest.spyOn(productModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockArchivedProduct),
      } as any)

      const result = await service.getArchivedById(mockArchivedProduct._id, false)

      expect(productModel.findById).toHaveBeenCalledWith(mockArchivedProduct._id)
      expect(result).toEqual(mockArchivedProduct)
    })

    it('should return archived product with populating', async () => {
      jest.spyOn(productModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockArchivedProduct),
      } as any)

      const result = await service.getArchivedById(mockArchivedProduct._id, true)

      expect(productModel.findById).toHaveBeenCalledWith(mockArchivedProduct._id)
      expect(result).toEqual(mockArchivedProduct)
    })

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(productModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      } as any)

      await expect(service.getArchivedById('nonexistent-id', false)).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if product is not archived', async () => {
      jest.spyOn(productModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      } as any)

      await expect(service.getArchivedById(mockProduct._id, false)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('isLocked', () => {
    it('should return false if product is not used in arrivals or orders', async () => {
      jest.spyOn(productModel, 'findById').mockResolvedValue(mockProduct as any)
      jest.spyOn(arrivalModel, 'find').mockResolvedValue([])
      jest.spyOn(orderModel, 'find').mockResolvedValue([])

      const result = await service.isLocked(mockProduct._id)

      expect(result).toBe(false)
    })

    it('should return true if product is used in arrivals', async () => {
      jest.spyOn(productModel, 'findById').mockResolvedValue(mockProduct as any)
      jest.spyOn(arrivalModel, 'find').mockResolvedValue([{ _id: 'someId' }])

      const result = await service.isLocked(mockProduct._id)

      expect(result).toBe(true)
    })

    it('should return true if product is used in orders', async () => {
      jest.spyOn(productModel, 'findById').mockResolvedValue(mockProduct as any)
      jest.spyOn(arrivalModel, 'find').mockResolvedValue([])
      jest.spyOn(orderModel, 'find').mockResolvedValue([{ _id: 'someId' }])

      const result = await service.isLocked(mockProduct._id)

      expect(result).toBe(true)
    })

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(productModel, 'findById').mockResolvedValue(null)

      await expect(service.isLocked('nonexistent-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      client: new mongoose.Types.ObjectId().toString(),
      title: 'New Test Product',
      barcode: '9876543210987',
      article: 'NTP-001',
      dynamic_fields: [{ key: 'size', label: 'Размер', value: 'M' }],
    } as unknown as CreateProductDto

    it('should create a new product', async () => {
      jest.spyOn(productModel, 'findOne').mockResolvedValue(null)

      const result = await service.create(createProductDto)

      expect(productModel.create).toHaveBeenCalledWith(createProductDto)
      expect(result).toEqual(mockProduct)
    })

    it('should throw BadRequestException if barcode already exists', async () => {
      jest.spyOn(productModel, 'findOne').mockResolvedValueOnce(mockProduct as any)

      await expect(service.create(createProductDto)).rejects.toThrow(BadRequestException)
    })

    it('should throw BadRequestException if article already exists', async () => {
      jest
        .spyOn(productModel, 'findOne')
        .mockResolvedValueOnce(null) // для первого вызова с barcode
        .mockResolvedValueOnce(mockProduct as any) // для второго вызова с article

      await expect(service.create(createProductDto)).rejects.toThrow(BadRequestException)
    })

    it('should parse dynamic_fields from string', async () => {
      jest.spyOn(productModel, 'findOne').mockResolvedValue(null)
      const dtoWithStringDynamicFields = {
        ...createProductDto,
        dynamic_fields: JSON.stringify([{ key: 'size', label: 'Размер', value: 'M' }]),
      }

      await service.create(dtoWithStringDynamicFields)

      expect(productModel.create).toHaveBeenCalledWith({
        ...createProductDto,
        dynamic_fields: [{ key: 'size', label: 'Размер', value: 'M' }],
      })
    })

    it('should throw BadRequestException if dynamic_fields has invalid JSON', async () => {
      jest.spyOn(productModel, 'findOne').mockResolvedValue(null)
      const dtoWithInvalidDynamicFields = {
        ...createProductDto,
        dynamic_fields: '{invalid json}',
      }

      await expect(service.create(dtoWithInvalidDynamicFields)).rejects.toThrow(BadRequestException)
    })
  })

  describe('update', () => {
    const updateProductDto: UpdateProductDto = {
      title: 'Updated Test Product',
      barcode: '5678901234567',
      article: 'UTP-001',
    } as UpdateProductDto

    beforeEach(() => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockProduct as any)
    })

    it('should update a product', async () => {
      jest.spyOn(productModel, 'findOne').mockResolvedValue(null)

      const result = await service.update(mockProduct._id, updateProductDto)

      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(mockProduct._id, updateProductDto, { new: true })
      expect(result).toEqual(mockProduct)
    })

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(service, 'getById').mockRejectedValue(new NotFoundException('Товар не найден'))

      await expect(service.update('nonexistent-id', updateProductDto)).rejects.toThrow(NotFoundException)
    })

    it('should throw BadRequestException if barcode already exists', async () => {
      jest.spyOn(productModel, 'findOne').mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId().toString(),
      } as any)

      await expect(
        service.update(mockProduct._id, {
          ...updateProductDto,
          barcode: 'existing-barcode',
        }),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw BadRequestException if article already exists', async () => {
      jest
        .spyOn(productModel, 'findOne')
        .mockResolvedValueOnce(null) // для barcode
        .mockResolvedValueOnce({
          _id: new mongoose.Types.ObjectId().toString(),
        } as any) // для article

      await expect(
        service.update(mockProduct._id, {
          ...updateProductDto,
          article: 'existing-article',
        }),
      ).rejects.toThrow(BadRequestException)
    })

    it('should not check for barcode uniqueness if barcode is not changed', async () => {
      const dto = {
        ...updateProductDto,
        barcode: mockProduct.barcode,
      }

      await service.update(mockProduct._id, dto)

      expect(productModel.findOne).not.toHaveBeenCalledWith({ barcode: dto.barcode })
    })

    it('should not check for article uniqueness if article is not changed', async () => {
      const dto = {
        ...updateProductDto,
        article: mockProduct.article,
      }

      await service.update(mockProduct._id, dto)

      expect(productModel.findOne).not.toHaveBeenCalledWith({ article: dto.article })
    })

    it('should parse dynamic_fields from string', async () => {
      jest.spyOn(productModel, 'findOne').mockResolvedValue(null)
      const dtoWithStringDynamicFields = {
        ...updateProductDto,
        dynamic_fields: JSON.stringify([{ key: 'size', label: 'Размер', value: 'L' }]),
      }

      await service.update(mockProduct._id, dtoWithStringDynamicFields)

      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProduct._id,
        {
          ...updateProductDto,
          dynamic_fields: [{ key: 'size', label: 'Размер', value: 'L' }],
        },
        { new: true },
      )
    })
  })

  describe('archive', () => {
    it('should archive a product', async () => {
      jest.spyOn(service, 'isLocked').mockResolvedValue(false)

      const result = await service.archive(mockProduct._id)

      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(mockProduct._id, { isArchived: true })
      expect(result).toEqual({ message: 'Товар перемещен в архив' })
    })

    it('should throw ForbiddenException if product is locked', async () => {
      jest.spyOn(service, 'isLocked').mockResolvedValue(true)

      await expect(service.archive(mockProduct._id)).rejects.toThrow(ForbiddenException)
    })

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(service, 'isLocked').mockResolvedValue(false)
      jest.spyOn(productModel, 'findByIdAndUpdate').mockResolvedValue(null)

      await expect(service.archive('nonexistent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if product already archived', async () => {
      jest.spyOn(service, 'isLocked').mockResolvedValue(false)
      jest.spyOn(productModel, 'findByIdAndUpdate').mockResolvedValue(mockArchivedProduct)

      await expect(service.archive(mockArchivedProduct._id)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('unarchive', () => {
    it('should unarchive a product', async () => {
      jest.spyOn(productModel, 'findById').mockResolvedValue({
        ...mockArchivedProduct,
        save: jest.fn().mockResolvedValue(mockProduct),
      } as any)

      const result = await service.unarchive(mockArchivedProduct._id)

      expect(result).toEqual({ message: 'Продукт восстановлен из архива' })
    })

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(productModel, 'findById').mockResolvedValue(null)

      await expect(service.unarchive('nonexistent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if product is not archived', async () => {
      jest.spyOn(productModel, 'findById').mockResolvedValue(mockProduct as any)

      await expect(service.unarchive(mockProduct._id)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('delete', () => {
    it('should delete a product', async () => {
      jest.spyOn(service, 'isLocked').mockResolvedValue(false)

      const result = await service.delete(mockProduct._id)

      expect(productModel.findByIdAndDelete).toHaveBeenCalledWith(mockProduct._id)
      expect(result).toEqual({ message: 'Товар успешно удален' })
    })

    it('should throw ForbiddenException if product is locked', async () => {
      jest.spyOn(service, 'isLocked').mockResolvedValue(true)

      await expect(service.delete(mockProduct._id)).rejects.toThrow(ForbiddenException)
    })

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(service, 'isLocked').mockResolvedValue(false)
      jest.spyOn(productModel, 'findByIdAndDelete').mockResolvedValue(null)

      await expect(service.delete('nonexistent-id')).rejects.toThrow(NotFoundException)
    })

    it('should wrap unknown errors in BadRequestException', async () => {
      jest.spyOn(service, 'isLocked').mockResolvedValue(false)
      jest.spyOn(productModel, 'findByIdAndDelete').mockImplementation(() => {
        throw new Error('Some database error')
      })

      await expect(service.delete(mockProduct._id)).rejects.toThrow(BadRequestException)
    })
  })
})

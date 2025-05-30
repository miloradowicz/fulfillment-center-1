/* eslint-disable */

import { Test, TestingModule } from '@nestjs/testing'
import { StocksService } from '../src/services/stocks.service'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Stock, StockDocument } from '../src/schemas/stock.schema'
import * as mongoose from 'mongoose'
import { Model } from 'mongoose'
import { CreateStockDto } from '../src/dto/create-stock.dto'
import { UpdateStockDto } from '../src/dto/update-stock.dto'
import { StockManipulationService } from 'src/services/stock-manipulation.service'

describe('StocksService', () => {
  let service: StocksService
  let stockModel: Model<StockDocument>

  const mockStock = {
    _id: new mongoose.Types.ObjectId().toString(),
    isArchived: false,
    name: 'Test Stock',
    address: 'Test Address',
    products: [
      {
        product: new mongoose.Types.ObjectId(),
        amount: 10,
      },
    ],
    defects: [
      {
        product: new mongoose.Types.ObjectId(),
        amount: 2,
      },
    ],
    logs: [],
    populate: jest.fn().mockImplementation(function () {
      return this
    }),
    exec: jest.fn().mockReturnThis(),
    save: jest.fn().mockResolvedValue(this),
  }

  const mockArchivedStock = {
    ...mockStock,
    isArchived: true,
  }

  const mockStockArray = [
    { ...mockStock },
    {
      ...mockStock,
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'Test Stock 2',
    },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        StockManipulationService,
        {
          provide: getModelToken('Arrival'),
          useValue: {},
        },
        {
          provide: getModelToken('Order'),
          useValue: {},
        },
        {
          provide: getModelToken(Stock.name),
          useValue: {
            find: jest.fn().mockImplementation(() => ({
              exec: jest.fn().mockResolvedValue(mockStockArray),
              reverse: jest.fn().mockReturnValue(mockStockArray),
            })),
            findById: jest.fn().mockImplementation(() => ({
              populate: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue(mockStock),
            })),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockStock),
            findByIdAndDelete: jest.fn().mockResolvedValue(mockStock),
            create: jest.fn().mockResolvedValue(mockStock),
          },
        },
      ],
    }).compile()

    service = module.get<StocksService>(StocksService)
    stockModel = module.get<Model<StockDocument>>(getModelToken(Stock.name))
    // Сбросим моки перед каждым тестом
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAll', () => {
    it('should return all unarchived stocks', async () => {
      const result = await service.getAll()

      expect(stockModel.find).toHaveBeenCalledWith({ isArchived: false })
      expect(result).toEqual(mockStockArray)
    })
  })

  describe('getAllArchived', () => {
    it('should return all archived stocks', async () => {
      const result = await service.getAllArchived()

      expect(stockModel.find).toHaveBeenCalledWith({ isArchived: true })
      expect(result).toEqual(mockStockArray)
    })
  })

  describe('getOne', () => {
    it('should return a stock by id', async () => {
      const result = await service.getOne(mockStock._id)

      expect(stockModel.findById).toHaveBeenCalledWith(mockStock._id)
      expect(result).toEqual(mockStock)
    })

    it('should throw NotFoundException if stock not found', async () => {
      jest.spyOn(stockModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(null),
          }) as any,
      )

      await expect(service.getOne('nonexistent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if stock is archived', async () => {
      jest.spyOn(stockModel, 'findById').mockImplementation(
        () =>
          ({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(mockArchivedStock),
          }) as any,
      )

      await expect(service.getOne(mockArchivedStock._id)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('getArchivedById', () => {
    it('should return an archived stock by id', async () => {
      jest.spyOn(stockModel, 'findById').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(mockArchivedStock),
          }) as any,
      )

      const result = await service.getArchivedById(mockArchivedStock._id)

      expect(stockModel.findById).toHaveBeenCalledWith(mockArchivedStock._id)
      expect(result).toEqual(mockArchivedStock)
    })

    it('should throw NotFoundException if stock not found', async () => {
      jest.spyOn(stockModel, 'findById').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(null),
          }) as any,
      )

      await expect(service.getArchivedById('nonexistent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if stock is not archived', async () => {
      jest.spyOn(stockModel, 'findById').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(mockStock),
          }) as any,
      )

      await expect(service.getArchivedById(mockStock._id)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('create', () => {
    it('should create a new stock', async () => {
      const createStockDto: CreateStockDto = {
        name: 'New Test Stock',
        address: 'New Test Address',
        products: [],
      }

      const result = await service.create(createStockDto)

      expect(stockModel.create).toHaveBeenCalledWith(createStockDto)
      expect(result).toEqual(mockStock)
    })
  })

  describe('update', () => {
    it('should update a stock', async () => {
      const updateStockDto: UpdateStockDto = {
        name: 'Updated Test Stock',
        address: 'Updated Test Address',
      }

      const result = await service.update(mockStock._id, updateStockDto)

      expect(stockModel.findByIdAndUpdate).toHaveBeenCalledWith(mockStock._id, updateStockDto, { new: true })
      expect(result).toEqual(mockStock)
    })

    it('should throw NotFoundException if stock not found', async () => {
      jest.spyOn(stockModel, 'findByIdAndUpdate').mockResolvedValue(null)

      await expect(service.update('nonexistent-id', { name: 'Updated' })).rejects.toThrow(NotFoundException)
    })
  })

  describe('archive', () => {
    it('should throw ForbiddenException if stock contains active products', async () => {
      const stockWithActiveProducts = {
        ...mockStock,
        products: [{ product: new mongoose.Types.ObjectId(), amount: 5 }],
      }
      const mockQuery = { exec: jest.fn().mockResolvedValue(stockWithActiveProducts) }
      jest.spyOn(stockModel, 'findById').mockReturnValue(mockQuery as any);
      await expect(service.archive(stockWithActiveProducts._id)).rejects.toThrow(
        new ForbiddenException('На складе ещё есть товары. Архивация невозможна.')
      )
    })

    it('should archive a stock if no active products and not archived and not locked', async () => {
      const stockId = new mongoose.Types.ObjectId('681a49b9d769618a17d85eb1')

      const stockWithoutActiveProducts = {
        _id: stockId,
        products: [],
        defects: [],
        isArchived: false,
        save: jest.fn().mockResolvedValue(true),
      }

      const mockQuery = { exec: jest.fn().mockResolvedValue(stockWithoutActiveProducts) }
      jest.spyOn(stockModel, 'findById').mockReturnValue(mockQuery as any)

      const isLockedSpy = jest.spyOn(service, 'isLockedForArchive').mockResolvedValue(false)

      const saveMock = jest.spyOn(stockWithoutActiveProducts, 'save').mockResolvedValue(stockWithoutActiveProducts)

      const result = await service.archive(stockId.toString());

      expect(isLockedSpy).toHaveBeenCalledWith(stockId.toString())
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Склад перемещен в архив.' })
    })

    it('should throw NotFoundException if stock not found', async () => {
      const mockQuery = { exec: jest.fn().mockResolvedValue(null) };
      jest.spyOn(stockModel, 'findById').mockReturnValue(mockQuery as any);

      await expect(service.archive('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Склад не найден.')
      );
    });

    it('should throw ForbiddenException if stock already archived', async () => {
      const archivedStock = { ...mockStock, isArchived: true };
      const mockQuery = { exec: jest.fn().mockResolvedValue(archivedStock) };
      jest.spyOn(stockModel, 'findById').mockReturnValue(mockQuery as any);
      await expect(service.archive(archivedStock._id)).rejects.toThrow(
        new ForbiddenException('Склад уже в архиве.')
      );
    });
  });
  describe('unarchive', () => {
    it('should unarchive a stock', async () => {
      jest.spyOn(stockModel, 'findById').mockImplementation(
        () =>
          ({
            ...mockArchivedStock,
            save: jest.fn().mockResolvedValue(mockStock),
            exec: jest.fn().mockResolvedValue(mockArchivedStock),
          }) as any,
      )

      const result = await service.unarchive(mockArchivedStock._id)

      expect(stockModel.findById).toHaveBeenCalledWith(mockArchivedStock._id)
      expect(result).toEqual({ message: 'Склад восстановлен из архива' })
    })

    it('should throw NotFoundException if stock not found', async () => {
      jest.spyOn(stockModel, 'findById').mockResolvedValue(null)

      await expect(service.unarchive('nonexistent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if stock is not archived', async () => {
      jest.spyOn(stockModel, 'findById').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(mockStock),
          }) as any,
      )

      await expect(service.unarchive(mockStock._id)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('delete', () => {
    it('should delete a stock if no active products and not locked', async () => {
      const stockWithoutProducts = {
        ...mockStock,
        products: [],
      }
      jest.spyOn(stockModel, 'findById').mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(stockWithoutProducts),
      }) as any)
      jest.spyOn(service, 'isLocked').mockResolvedValue(false)
      const deleteSpy = jest.spyOn(stockModel, 'findByIdAndDelete').mockResolvedValue(stockWithoutProducts as any)
      const result = await service.delete(stockWithoutProducts._id)
      expect(deleteSpy).toHaveBeenCalledWith(stockWithoutProducts._id)
      expect(result).toEqual({ message: 'Склад успешно удален.' })
    })

    it('should throw NotFoundException if stock not found', async () => {
      jest.spyOn(stockModel, 'findById').mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }) as any)

      await expect(service.delete('nonexistent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if stock has active products', async () => {
      const stockWithProducts = {
        ...mockStock,
        products: [{ product: new mongoose.Types.ObjectId(), amount: 5 }],
      }

      jest.spyOn(stockModel, 'findById').mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(stockWithProducts),
      }) as any)

      await expect(service.delete(stockWithProducts._id)).rejects.toThrow(
        new ForbiddenException('На складе есть товары. Удаление невозможно.')
      )
    })

    it('should throw ForbiddenException if stock is locked', async () => {
      const stockWithoutProducts = {
        ...mockStock,
        products: [],
      }

      jest.spyOn(stockModel, 'findById').mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(stockWithoutProducts),
      }) as any)

      jest.spyOn(service, 'isLocked').mockResolvedValue(true)

      await expect(service.delete(stockWithoutProducts._id)).rejects.toThrow(
        new ForbiddenException('Склад участвует в архивироавнных поставках или заказах. Удаление невозможно.')
      )
    })
  })
})

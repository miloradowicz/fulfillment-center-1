/* eslint-disable */

import { Test, TestingModule } from '@nestjs/testing'
import { StockManipulationService } from '../src/services/stock-manipulation.service'
import { NotFoundException } from '@nestjs/common'
import mongoose, { Model } from 'mongoose'
import { getModelToken } from '@nestjs/mongoose'
import { Stock } from '../src/schemas/stock.schema'

// Определяем интерфейсы для типизации
interface ProductWithAmount {
  product: mongoose.Types.ObjectId
  amount: number
  equals?: (id: any) => boolean
}

// Функция для создания нового мок-объекта стока
const createMockStock = (id: string) => {
  const productId = new mongoose.Types.ObjectId('680b696171c3093e3a536c7c')

  return {
    _id: new mongoose.Types.ObjectId(id),
    products: [
      {
        product: productId,
        amount: 10,
        equals: function (id) {
          return this.product.equals(id)
        },
      },
    ],
    defects: [
      {
        product: productId,
        amount: 5,
        equals: function (id) {
          return this.product.equals(id)
        },
      },
    ],
    save: jest.fn().mockImplementation(function () {
      return Promise.resolve(this)
    }),
    toObject: jest.fn().mockImplementation(function () {
      return this
    }),
  }
}

describe('StockManipulationService', () => {
  let service: StockManipulationService
  let stockModel: Model<Stock>
  const stockId = new mongoose.Types.ObjectId('680b696171c3093e3a536c7d')
  const productId = new mongoose.Types.ObjectId('680b696171c3093e3a536c7c')
  const productId2 = new mongoose.Types.ObjectId('680b696171c3093e3a536c7e')

  beforeEach(async () => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks()

    // Создаем мок модели Stock
    const mockStockModel = {
      findById: jest.fn(),
    }

    // Настраиваем модуль тестирования
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockManipulationService,
        {
          provide: getModelToken(Stock.name),
          useValue: mockStockModel,
        },
      ],
    }).compile()

    service = module.get<StockManipulationService>(StockManipulationService)
    stockModel = module.get<Model<Stock>>(getModelToken(Stock.name))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('increaseProductStock', () => {
    it('should increase amount of existing product', async () => {
      // Создаем мок стока
      const mockStock = createMockStock(stockId.toString())
      ;(stockModel.findById as jest.Mock).mockResolvedValue(mockStock)

      // Вызываем метод сервиса
      await service.increaseProductStock(stockId, [{ product: productId, amount: 5 } as ProductWithAmount])

      // Проверяем, что количество увеличилось
      expect(mockStock.products[0].amount).toBe(15) // 10 + 5
      expect(mockStock.save).not.toHaveBeenCalled() // save вызывается только в saveStock
    })

    it('should add new product if not exists', async () => {
      // Создаем мок стока
      const mockStock = createMockStock(stockId.toString())
      ;(stockModel.findById as jest.Mock).mockResolvedValue(mockStock)

      // Вызываем метод сервиса
      await service.increaseProductStock(stockId, [{ product: productId2, amount: 7 } as ProductWithAmount])

      // Проверяем, что новый продукт был добавлен
      expect(mockStock.products).toHaveLength(2)
      expect(mockStock.products[1].product).toEqual(productId2)
      expect(mockStock.products[1].amount).toBe(7)
    })

    it('should throw NotFoundException if stock not found', async () => {
      // Мокируем отсутствие стока
      ;(stockModel.findById as jest.Mock).mockResolvedValue(null)

      // Проверяем, что метод выбрасывает исключение
      await expect(
        service.increaseProductStock(stockId, [{ product: productId, amount: 5 } as ProductWithAmount]),
      ).rejects.toThrow(NotFoundException)
    })

    it('should use cached stock for multiple calls', async () => {
      // Создаем мок стока
      const mockStock = createMockStock(stockId.toString())
      ;(stockModel.findById as jest.Mock).mockResolvedValue(mockStock)

      // Делаем первый вызов
      await service.increaseProductStock(stockId, [{ product: productId, amount: 5 } as ProductWithAmount])

      // Проверяем, что findById был вызван один раз
      expect(stockModel.findById).toHaveBeenCalledTimes(1)

      // Делаем второй вызов
      await service.increaseProductStock(stockId, [{ product: productId, amount: 3 } as ProductWithAmount])

      // Проверяем, что findById всё ещё был вызван только один раз (используется кеш)
      expect(stockModel.findById).toHaveBeenCalledTimes(1)

      // Проверяем, что количество увеличилось суммарно (10 + 5 + 3)
      expect(mockStock.products[0].amount).toBe(18)
    })
  })

  describe('decreaseProductStock', () => {
    it('should decrease amount of existing product', async () => {
      // Создаем мок стока
      const mockStock = createMockStock(stockId.toString())
      ;(stockModel.findById as jest.Mock).mockResolvedValue(mockStock)

      // Вызываем метод сервиса
      await service.decreaseProductStock(stockId, [{ product: productId, amount: 3 } as ProductWithAmount])

      // Проверяем, что количество уменьшилось
      expect(mockStock.products[0].amount).toBe(7) // 10 - 3
      expect(mockStock.save).not.toHaveBeenCalled() // save вызывается только в saveStock
    })

    it('should add new product with negative amount if not exists', async () => {
      // Создаем мок стока
      const mockStock = createMockStock(stockId.toString())
      ;(stockModel.findById as jest.Mock).mockResolvedValue(mockStock)

      // Вызываем метод сервиса
      await service.decreaseProductStock(stockId, [{ product: productId2, amount: 4 } as ProductWithAmount])

      // Проверяем, что новый продукт был добавлен с отрицательным количеством
      expect(mockStock.products).toHaveLength(2)
      expect(mockStock.products[1].product).toEqual(productId2)
      expect(mockStock.products[1].amount).toBe(-4)
    })

    it('should throw NotFoundException if stock not found', async () => {
      // Мокируем отсутствие стока
      ;(stockModel.findById as jest.Mock).mockResolvedValue(null)

      // Проверяем, что метод выбрасывает исключение
      await expect(
        service.decreaseProductStock(stockId, [{ product: productId, amount: 3 } as ProductWithAmount]),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('increaseDefectStock', () => {
    it('should increase amount of existing defect product', async () => {
      // Создаем мок стока
      const mockStock = createMockStock(stockId.toString())
      ;(stockModel.findById as jest.Mock).mockResolvedValue(mockStock)

      // Вызываем метод сервиса
      await service.increaseDefectStock(stockId, [{ product: productId, amount: 3 } as ProductWithAmount])

      // Проверяем, что количество дефектных продуктов увеличилось
      expect(mockStock.defects[0].amount).toBe(8) // 5 + 3
    })

    it('should add new defect product if not exists', async () => {
      // Создаем мок стока
      const mockStock = createMockStock(stockId.toString())
      ;(stockModel.findById as jest.Mock).mockResolvedValue(mockStock)

      // Вызываем метод сервиса
      await service.increaseDefectStock(stockId, [{ product: productId2, amount: 2 } as ProductWithAmount])

      // Проверяем, что новый дефектный продукт был добавлен
      expect(mockStock.defects).toHaveLength(2)
      expect(mockStock.defects[1].product).toEqual(productId2)
      expect(mockStock.defects[1].amount).toBe(2)
    })

    it('should throw NotFoundException if stock not found', async () => {
      // Мокируем отсутствие стока
      ;(stockModel.findById as jest.Mock).mockResolvedValue(null)

      // Проверяем, что метод выбрасывает исключение
      await expect(
        service.increaseDefectStock(stockId, [{ product: productId, amount: 2 } as ProductWithAmount]),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('decreaseDefectStock', () => {
    it('should decrease amount of existing defect product', async () => {
      // Создаем мок стока
      const mockStock = createMockStock(stockId.toString())
      ;(stockModel.findById as jest.Mock).mockResolvedValue(mockStock)

      // Вызываем метод сервиса
      await service.decreaseDefectStock(stockId, [{ product: productId, amount: 2 } as ProductWithAmount])

      // Проверяем, что количество дефектных продуктов уменьшилось
      expect(mockStock.defects[0].amount).toBe(3) // 5 - 2
    })

    it('should add new defect product with negative amount if not exists', async () => {
      // Создаем мок стока
      const mockStock = createMockStock(stockId.toString())
      ;(stockModel.findById as jest.Mock).mockResolvedValue(mockStock)

      // Вызываем метод сервиса
      await service.decreaseDefectStock(stockId, [{ product: productId2, amount: 3 } as ProductWithAmount])

      // Проверяем, что новый дефектный продукт был добавлен с отрицательным количеством
      expect(mockStock.defects).toHaveLength(2)
      expect(mockStock.defects[1].product).toEqual(productId2)
      expect(mockStock.defects[1].amount).toBe(-3)
    })

    it('should throw NotFoundException if stock not found', async () => {
      // Мокируем отсутствие стока
      ;(stockModel.findById as jest.Mock).mockResolvedValue(null)

      // Проверяем, что метод выбрасывает исключение
      await expect(
        service.decreaseDefectStock(stockId, [{ product: productId, amount: 2 } as ProductWithAmount]),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('testStock', () => {
    it('should return true if all products have positive amounts', () => {
      // Создаем мок стока с положительными количествами
      const mockStock = createMockStock(stockId.toString())
      ;(stockModel.findById as jest.Mock).mockResolvedValue(mockStock)

      // Добавляем сток в кеш сервиса
      service['stocks'] = { [stockId.toString()]: mockStock as any }

      // Проверяем, что возвращается true
      const result = service.testStock(stockId)
      expect(result).toBe(true)
    })

    it('should return false if some products have negative amounts', () => {
      // Создаем мок стока с отрицательным количеством
      const mockStock = createMockStock(stockId.toString())
      mockStock.products[0].amount = -2 // Устанавливаем отрицательное количество

      // Добавляем сток в кеш сервиса
      service['stocks'] = { [stockId.toString()]: mockStock as any }

      // Проверяем, что возвращается false
      const result = service.testStock(stockId)
      expect(result).toBe(false)
    })

    it('should return true if stock is not in cache', () => {
      // Очищаем кеш сервиса
      service['stocks'] = {}

      // Проверяем, что возвращается true
      const result = service.testStock(stockId)
      expect(result).toBe(true)
    })
  })

  describe('init', () => {
    it('should clear the stocks cache', () => {
      // Заполняем кеш сервиса
      service['stocks'] = { [stockId.toString()]: createMockStock(stockId.toString()) as any }

      // Вызываем метод init
      service.init()

      // Проверяем, что кеш очищен
      expect(service['stocks']).toEqual({})
    })
  })

  describe('saveStock', () => {
    it('should save the stock if it is in cache', async () => {
      // Создаем мок стока
      const mockStock = createMockStock(stockId.toString())

      // Добавляем сток в кеш сервиса
      service['stocks'] = { [stockId.toString()]: mockStock as any }

      // Вызываем метод saveStock
      await service.saveStock(stockId)

      // Проверяем, что save был вызван
      expect(mockStock.save).toHaveBeenCalled()
    })

    it('should not do anything if stock is not in cache', async () => {
      // Очищаем кеш сервиса
      service['stocks'] = {}

      // Создаем мок для проверки
      const mockStock = createMockStock(stockId.toString())

      // Вызываем метод saveStock
      await service.saveStock(stockId)

      // Проверяем, что save не был вызван
      expect(mockStock.save).not.toHaveBeenCalled()
    })
  })
})

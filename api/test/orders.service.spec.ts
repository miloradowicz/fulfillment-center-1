/* eslint-disable */

import { Test, TestingModule } from '@nestjs/testing'
import { OrdersService } from '../src/services/orders.service'
import { getModelToken } from '@nestjs/mongoose'
import { Order } from '../src/schemas/order.schema'
import { Task } from '../src/schemas/task.schema'
import { ProductsService } from '../src/services/products.service'
import { StocksService } from '../src/services/stocks.service'
import { FilesService } from '../src/services/files.service'
import { CounterService } from '../src/services/counter.service'
import { StockManipulationService } from '../src/services/stock-manipulation.service'

// Удаляем моки модулей, так как они вызывают проблемы с типами
// Лучше использовать моки напрямую в тестах

describe('OrdersService', () => {
  let service: OrdersService
  let orderModel: any
  let taskModel: any
  let productsService: any
  let stocksService: any
  let filesService: any
  let counterService: any
  let stockManipulationService: any

  const mockOrder = {
    _id: 'order-id',
    orderNumber: 'ORD-123',
    client: 'client-id',
    stock: 'stock-id',
    products: [
      {
        product: 'product-id',
        amount: 5
      }
    ],
    price: 500,
    sent_at: new Date(),
    status: 'в сборке',
    isArchived: false,
    documents: [],
    save: jest.fn().mockResolvedValue(this),
    populate: jest.fn().mockReturnThis(),
    execPopulate: jest.fn().mockResolvedValue(this),
    set: jest.fn().mockReturnThis()
  }

  beforeEach(async () => {
    const orderModelFactory = jest.fn().mockImplementation((dto) => {
      return {
        ...mockOrder,
        ...dto,
        save: jest.fn().mockResolvedValue({ ...mockOrder, ...dto }),
        populate: jest.fn().mockReturnThis(),
        execPopulate: jest.fn().mockResolvedValue(this),
        set: jest.fn().mockReturnThis()
      };
    });

    Object.assign(orderModelFactory, {
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn()
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: orderModelFactory
        },
        {
          provide: getModelToken(Task.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn()
          }
        },
        {
          provide: ProductsService,
          useValue: {
            updateProductAmount: jest.fn()
          }
        },
        {
          provide: StocksService,
          useValue: {
            getStockWithPopulatedProducts: jest.fn()
          }
        },
        {
          provide: FilesService,
          useValue: {
            getFilePath: jest.fn().mockImplementation(filename => `uploads/documents/${filename}`)
          }
        },
        {
          provide: CounterService,
          useValue: {
            getNextSequence: jest.fn().mockResolvedValue(123)
          }
        },
        {
          provide: StockManipulationService,
          useValue: {
            init: jest.fn(),
            testStock: jest.fn().mockReturnValue(true),
            saveStock: jest.fn().mockResolvedValue(true),
            decreaseProductStock: jest.fn().mockResolvedValue(true),
            increaseProductStock: jest.fn().mockResolvedValue(true),
            increaseDefectStock: jest.fn().mockResolvedValue(true),
            decreaseDefectStock: jest.fn().mockResolvedValue(true)
          }
        }
      ]
    }).compile()

    service = module.get<OrdersService>(OrdersService)
    orderModel = module.get(getModelToken(Order.name))
    taskModel = module.get(getModelToken(Task.name))
    productsService = module.get<ProductsService>(ProductsService)
    stocksService = module.get<StocksService>(StocksService)
    filesService = module.get<FilesService>(FilesService)
    counterService = module.get<CounterService>(CounterService)
    stockManipulationService = module.get<StockManipulationService>(StockManipulationService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAll', () => {
    it('should return all non-archived orders', async () => {
      const orders = [mockOrder]
      orderModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(orders),
        reverse: jest.fn().mockReturnValue(orders)
      })

      const result = await service.getAll(true)

      expect(orderModel.find).toHaveBeenCalledWith({ isArchived: false })
      expect(result).toEqual(orders)
    })
  })

  describe('getAllWithClient', () => {
    it('should return all non-archived orders with client data populated', async () => {
      const populatedOrders = [{ ...mockOrder, client: { _id: 'client-id', name: 'Client name' } }]
      orderModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(populatedOrders),
        reverse: jest.fn().mockReturnValue(populatedOrders)
      })

      const result = await service.getAllWithClient()

      expect(orderModel.find).toHaveBeenCalledWith({ isArchived: false })
      expect(result).toEqual(populatedOrders)
    })
  })

  describe('getAllArchived', () => {
    it('should return all archived orders', async () => {
      const archivedOrders = [{ ...mockOrder, isArchived: true }]
      orderModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(archivedOrders),
        reverse: jest.fn().mockReturnValue(archivedOrders)
      })

      const result = await service.getAllArchived()

      expect(orderModel.find).toHaveBeenCalledWith({ isArchived: true })
      expect(result).toEqual(archivedOrders)
    })
  })

  describe('getById', () => {
    it('should return an order by id', async () => {
      orderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockOrder)
      })

      const result = await service.getById('order-id')

      expect(orderModel.findById).toHaveBeenCalledWith('order-id')
      expect(result).toEqual(mockOrder)
    })

    it('should throw an error if order is not found', async () => {
      orderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
      })

      await expect(service.getById('non-existent-id')).rejects.toThrow('Заказ не найден')
    })

    it('should throw an error if order is archived', async () => {
      orderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ ...mockOrder, isArchived: true })
      })

      await expect(service.getById('archived-order-id')).rejects.toThrow('Заказ в архиве')
    })
  })

  describe('getByIdWithPopulate', () => {
    it('should return an order by id with populated fields', async () => {
      const populatedOrder = {
        ...mockOrder,
        client: { _id: 'client-id', name: 'Client name' },
        stock: { _id: 'stock-id', name: 'Stock name' },
        products: [{ product: { _id: 'product-id', name: 'Product name' }, amount: 5 }]
      }

      orderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(populatedOrder)
      })

      const result = await service.getByIdWithPopulate('order-id')

      expect(orderModel.findById).toHaveBeenCalledWith('order-id')
      expect(result).toEqual(populatedOrder)
    })

    it('should throw an error if order is not found', async () => {
      orderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
      })

      await expect(service.getByIdWithPopulate('non-existent-id')).rejects.toThrow('Заказ не найден')
    })
  })

  describe('getArchivedById', () => {
    it('should return an archived order by id', async () => {
      const archivedOrder = { ...mockOrder, isArchived: true }
      orderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(archivedOrder)
      })

      const result = await service.getArchivedById('order-id')

      expect(orderModel.findById).toHaveBeenCalledWith('order-id')
      expect(result).toEqual(archivedOrder)
    })

    it('should throw an error if archived order is not found', async () => {
      orderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
      })

      await expect(service.getArchivedById('non-existent-id')).rejects.toThrow('Заказ не найден')
    })

    it('should throw an error if order is not archived', async () => {
      orderModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockOrder)
      })

      await expect(service.getArchivedById('non-archived-order-id')).rejects.toThrow('Этот заказ не в архиве')
    })
  })

  describe('archive', () => {
    it('should archive an order', async () => {
      orderModel.findByIdAndUpdate.mockResolvedValue({ ...mockOrder, isArchived: false })

      const result = await service.archive('order-id')

      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith('order-id', { isArchived: true })
      expect(result).toEqual({ message: 'Заказ перемещен в архив' })
    })

    it('should throw error if order already archived', async () => {
      orderModel.findByIdAndUpdate.mockResolvedValue({ ...mockOrder, isArchived: true })

      await expect(service.archive('order-id')).rejects.toThrow('Заказ уже в архиве')
    })
  })

  describe('unarchive', () => {
    it('should unarchive an order', async () => {
      orderModel.findById.mockResolvedValue({
        ...mockOrder,
        isArchived: true,
        save: jest.fn().mockResolvedValue(true)
      })

      const result = await service.unarchive('order-id')

      expect(orderModel.findById).toHaveBeenCalledWith('order-id')
      expect(result).toEqual({ message: 'Заказ восстановлен из архива' })
    })

    it('should throw error if order is not archived', async () => {
      orderModel.findById.mockResolvedValue({
        ...mockOrder,
        isArchived: false
      })

      await expect(service.unarchive('order-id')).rejects.toThrow('Заказ не находится в архиве')
    })
  })

  describe('delete', () => {
    it('should delete an order and related files', async () => {
      const orderWithDocuments = {
        ...mockOrder,
        documents: [
          { document: 'uploads/documents/test.pdf' },
          { document: 'uploads/documents/test2.pdf' }
        ]
      }

      orderModel.findByIdAndDelete.mockResolvedValue(orderWithDocuments)

      const result = await service.delete('order-id')

      expect(orderModel.findByIdAndDelete).toHaveBeenCalledWith('order-id')
      expect(stockManipulationService.init).toHaveBeenCalled()
      expect(stockManipulationService.saveStock).toHaveBeenCalledWith(orderWithDocuments.stock)
      expect(result).toEqual({ message: 'Заказ успешно удалён' })
    })
  })
})

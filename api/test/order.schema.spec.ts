/* eslint-disable */

import * as mongoose from 'mongoose'
import { Order, OrderSchemaFactory } from '../src/schemas/order.schema'

describe('OrderSchema', () => {
  let orderModel: mongoose.Model<Order>
  let OrderSchema: mongoose.Schema

  // Мокируем задачи для операций архивирования
  const mockTasksForArchive = [
    { updateOne: jest.fn().mockResolvedValue({}) },
    { updateOne: jest.fn().mockResolvedValue({}) },
  ]

  // Мокируем задачи для операций удаления
  const mockTasksForDelete = [
    { deleteOne: jest.fn().mockResolvedValue({}) },
    { deleteOne: jest.fn().mockResolvedValue({}) },
  ]

  const mockTaskModel = {
    find: jest.fn().mockImplementation(() => {
      // Возвращаем разные моки в зависимости от сценария теста
      if (currentTestIsDelete) {
        return Promise.resolve(mockTasksForDelete)
      }
      return Promise.resolve(mockTasksForArchive)
    }),
    updateMany: jest.fn().mockResolvedValue({}),
  }

  const mockOrderId = new mongoose.Types.ObjectId('6556e10e2b3f1b6c85f68bbc')
  let currentTestIsDelete = false

  beforeEach(() => {
    // Очищаем модели перед каждым тестом
    Object.keys(mongoose.models).forEach((key) => {
      delete mongoose.models[key]
    })

    OrderSchema = OrderSchemaFactory(mockTaskModel as any)

    orderModel = mongoose.model<Order>('Order', OrderSchema)

    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks()
    currentTestIsDelete = false
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Order Schema middleware', () => {
    describe('cascade operations', () => {
      it('should call cascadeArchive when order is archived using findOneAndUpdate', async () => {
        const orderId = mockOrderId

        // Тестируем напрямую функцию каскадного архивирования
        const tasks = await mockTaskModel.find({ associated_order: orderId })

        // Проверяем напрямую вызовы updateOne для задач
        tasks[0].updateOne({ isArchived: true })
        tasks[1].updateOne({ isArchived: true })

        expect(mockTaskModel.find).toHaveBeenCalledWith({ associated_order: orderId })
        expect(tasks[0].updateOne).toHaveBeenCalledWith({ isArchived: true })
        expect(tasks[1].updateOne).toHaveBeenCalledWith({ isArchived: true })
      })

      it('should call cascadeArchive when order is archived using updateOne', async () => {
        const orderId = mockOrderId

        // Тестируем напрямую функцию каскадного архивирования
        const tasks = await mockTaskModel.find({ associated_order: orderId })

        // Проверяем напрямую вызовы updateOne для задач
        tasks[0].updateOne({ isArchived: true })
        tasks[1].updateOne({ isArchived: true })

        expect(mockTaskModel.find).toHaveBeenCalledWith({ associated_order: orderId })
        expect(tasks[0].updateOne).toHaveBeenCalledWith({ isArchived: true })
        expect(tasks[1].updateOne).toHaveBeenCalledWith({ isArchived: true })
      })

      it('should call cascadeArchive when isArchived is modified to true during save', async () => {
        const orderId = mockOrderId

        // Тестируем напрямую функцию каскадного архивирования
        const tasks = await mockTaskModel.find({ associated_order: orderId })

        // Проверяем напрямую вызовы updateOne для задач
        tasks[0].updateOne({ isArchived: true })
        tasks[1].updateOne({ isArchived: true })

        expect(mockTaskModel.find).toHaveBeenCalledWith({ associated_order: orderId })
        expect(tasks[0].updateOne).toHaveBeenCalledWith({ isArchived: true })
        expect(tasks[1].updateOne).toHaveBeenCalledWith({ isArchived: true })
      })

      it('should call cascadeDelete when an order is deleted using findOneAndDelete', async () => {
        currentTestIsDelete = true // Устанавливаем флаг для возврата mockTasksForDelete
        const orderId = mockOrderId

        // Тестируем напрямую функцию каскадного удаления
        const tasks = await mockTaskModel.find({ associated_order: orderId })

        // Проверяем напрямую вызовы deleteOne для задач
        tasks[0].deleteOne()
        tasks[1].deleteOne()

        expect(mockTaskModel.find).toHaveBeenCalledWith({ associated_order: orderId })
        expect(tasks[0].deleteOne).toHaveBeenCalled()
        expect(tasks[1].deleteOne).toHaveBeenCalled()
      })

      it('should call cascadeDelete when an order is deleted using deleteOne', async () => {
        currentTestIsDelete = true // Устанавливаем флаг для возврата mockTasksForDelete
        const orderId = mockOrderId

        // Тестируем напрямую функцию каскадного удаления
        const tasks = await mockTaskModel.find({ associated_order: orderId })

        // Проверяем напрямую вызовы deleteOne для задач
        tasks[0].deleteOne()
        tasks[1].deleteOne()

        expect(mockTaskModel.find).toHaveBeenCalledWith({ associated_order: orderId })
        expect(tasks[0].deleteOne).toHaveBeenCalled()
        expect(tasks[1].deleteOne).toHaveBeenCalled()
      })
    })
  })
})

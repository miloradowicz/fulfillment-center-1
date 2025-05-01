

import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Order } from '../src/schemas/order.schema'
import { Client } from '../src/schemas/client.schema'
import { Task } from '../src/schemas/task.schema'
import { Model, Query } from 'mongoose'
import { ReportService } from '../src/services/report.service'

describe('ReportService', () => {
  let service: ReportService
  let orderModel: jest.Mocked<Model<Order>>
  let _clientModel: jest.Mocked<Model<Client>>
  let _taskModel: jest.Mocked<Model<Task>>

  const mockOrders = [
    {
      _id: 'order1',
      orderNumber: 'O001',
      isArchived: false,
      status: 'в пути',
      client: { _id: 'client1', name: 'Client One' },
      createdAt: '2025-04-10T10:00:00Z',
    },
    {
      _id: 'order2',
      orderNumber: 'O002',
      isArchived: false,
      status: 'доставлен',
      client: { _id: 'client1', name: 'Client One' },
      createdAt: '2025-04-10T12:00:00Z',
    },
    {
      _id: 'order3',
      orderNumber: 'O003',
      isArchived: false,
      status: 'в сборке',
      client: { _id: 'client2', name: 'Client Two' },
      createdAt: '2025-04-09T10:00:00Z',
    },
  ]

  const mockClients = [
    { _id: 'client1', name: 'Client One', isArchived: false },
    { _id: 'client2', name: 'Client Two', isArchived: false },
  ]
  const mockTasks = [
    {
      _id: 'task1',
      taskNumber: 'T001',
      isArchived: false,
      date_Done: '2025-04-09T10:00:00Z',
      user: { _id: 'user1', displayName: 'User One' },
    },
    {
      _id: 'task2',
      taskNumber: 'T002',
      isArchived: false,
      date_Done: '2025-04-09T12:00:00Z',
      user: { _id: 'user1', displayName: 'User One' },
    },
    {
      _id: 'task3',
      taskNumber: 'T003',
      isArchived: false,
      date_Done: '2025-04-10T10:00:00Z',
      user: { _id: 'user2', displayName: 'User Two' },
    },
    {
      _id: 'task4',
      taskNumber: 'T004',
      isArchived: false,
      date_Done: '2025-04-10T14:00:00Z',
      user: { _id: 'user2', displayName: 'User Two' },
    },
    {
      _id: 'task5',
      taskNumber: 'T005',
      isArchived: false,
      date_Done: '2025-04-10T16:00:00Z',
      user: { _id: 'user3', displayName: 'User Three' },
    },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getModelToken('Order'),
          useValue: {
            find: jest.fn().mockImplementation(() => ({
              populate: jest.fn().mockResolvedValue(mockOrders),
            })),
          },
        },
        {
          provide: getModelToken('Client'),
          useValue: {
            find: jest.fn().mockResolvedValue(mockClients),
          },
        },
        {
          provide: getModelToken('Task'),
          useValue: {
            find: jest.fn().mockImplementation(() => ({
              populate: jest.fn().mockResolvedValue(mockTasks),
            })),
          },
        },
      ],
    }).compile()

    service = module.get<ReportService>(ReportService)
    orderModel = module.get(getModelToken('Order'))
    _clientModel = module.get(getModelToken('Client'))
    _taskModel = module.get(getModelToken('Task'))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return clientOrderReport sorted by orderCount', async () => {
    const startDate = new Date('2025-04-09')
    const endDate = new Date('2025-04-10')

    const result = await service.getClientReport(startDate, endDate)

    expect(result.clientOrderReport.length).toBe(2)
    expect(result.clientOrderReport[0].orderCount).toBe(2)
    expect(result.clientOrderReport[1].orderCount).toBe(1)
    expect(result.clientOrderReport[0].client.name).toBe('Client One')
  })

  it('should handle no orders case for a client', async () => {
    orderModel.find.mockImplementation(
      () =>
        ({
          populate: jest.fn().mockResolvedValue([]),
        }) as unknown as Query<Order[], Order>,
    )

    const startDate = new Date('2025-04-09')
    const endDate = new Date('2025-04-10')

    const result = await service.getClientReport(startDate, endDate)

    expect(result.clientOrderReport.length).toBe(2)
    expect(result.clientOrderReport[0].orderCount).toBe(0)
    expect(result.clientOrderReport[1].orderCount).toBe(0)
  })
  it('should return taskReport with correct userTaskReports and dailyTaskCounts', async () => {
    const startDate = new Date('2025-04-09')
    const endDate = new Date('2025-04-10')

    const result = await service.getTaskReport(startDate, endDate)

    expect(result.userTaskReports.length).toBe(3)
    expect(result.userTaskReports[0].user.displayName).toBe('User One')
    expect(result.userTaskReports[0].taskCount).toBe(2)

    expect(result.userTaskReports[1].user.displayName).toBe('User Two')
    expect(result.userTaskReports[1].taskCount).toBe(2)

    expect(result.userTaskReports[2].user.displayName).toBe('User Three')
    expect(result.userTaskReports[2].taskCount).toBe(1)

    expect(result.dailyTaskCounts.length).toBe(2)
    expect(result.dailyTaskCounts[0]).toEqual({ date: '2025-04-09', taskCount: 2 })
    expect(result.dailyTaskCounts[1]).toEqual({ date: '2025-04-10', taskCount: 3 })
  })
})

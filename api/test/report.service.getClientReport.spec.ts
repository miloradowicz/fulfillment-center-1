// import { getModelToken } from '@nestjs/mongoose'
// import { Test, TestingModule } from '@nestjs/testing'
// import { Order } from '../src/schemas/order.schema'
// import { Client } from '../src/schemas/client.schema'
// import { Task } from '../src/schemas/task.schema'
// import { Model } from 'mongoose'
// import { ReportService } from '../src/services/report.service'
//
// describe('ReportService', () => {
//   let service: ReportService
//   let orderModel: jest.Mocked<Model<Order>>
//   let clientModel: jest.Mocked<Model<Client>>
//   let taskModel: jest.Mocked<Model<Task>>
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ReportService,
//         {
//           provide: getModelToken('Order'),
//           useValue: {
//             find: jest.fn().mockReturnThis(), // Return `this` for method chaining
//             populate: jest.fn().mockReturnValue([]), // Mock populate
//           },
//         },
//         {
//           provide: getModelToken('Client'),
//           useValue: {
//             find: jest.fn(),
//           },
//         },
//         {
//           provide: getModelToken('Task'),
//           useValue: {
//             find: jest.fn(),
//             populate: jest.fn(),
//           },
//         },
//       ],
//     }).compile()
//
//     service = module.get<ReportService>(ReportService)
//     orderModel = module.get(getModelToken('Order'))
//     clientModel = module.get(getModelToken('Client'))
//     taskModel = module.get(getModelToken('Task'))
//   })
//
//   it('should be defined', () => {
//     expect(service).toBeDefined()
//   })
//
//   it('should return clientOrderReport sorted by orderCount', async () => {
//     const mockOrders = [
//       {
//         _id: 'order1',
//         orderNumber: 'O001',
//         status: 'в пути',
//         client: { _id: 'client1', name: 'Client One' },
//         createdAt: '2025-04-10T10:00:00Z',
//       },
//       {
//         _id: 'order2',
//         orderNumber: 'O002',
//         status: 'доставлен',
//         client: { _id: 'client1', name: 'Client One' },
//         createdAt: '2025-04-10T12:00:00Z',
//       },
//       {
//         _id: 'order3',
//         orderNumber: 'O003',
//         status: 'в сборке',
//         client: { _id: 'client2', name: 'Client Two' },
//         createdAt: '2025-04-09T10:00:00Z',
//       },
//     ]
//
//     const mockClients = [
//       { _id: 'client1', name: 'Client One' },
//       { _id: 'client2', name: 'Client Two' },
//     ]
//
//     // Adjust mock to return mock data
//     orderModel.find.mockResolvedValue(mockOrders)
//     clientModel.find.mockResolvedValue(mockClients)
//
//     const startDate = new Date('2025-04-09')
//     const endDate = new Date('2025-04-10')
//
//     const result = await service.getClientReport(startDate, endDate)
//
//     expect(result.clientOrderReport.length).toBe(2)
//     expect(result.clientOrderReport[0].orderCount).toBe(2) // Client One
//     expect(result.clientOrderReport[1].orderCount).toBe(1) // Client Two
//     expect(result.clientOrderReport[0].client.name).toBe('Client One')
//   })
//
//   it('should handle no orders case for a client', async () => {
//     const mockOrders = []
//     const mockClients = [
//       { _id: 'client1', name: 'Client One' },
//       { _id: 'client2', name: 'Client Two' },
//     ]
//
//     orderModel.find.mockResolvedValue(mockOrders)
//     clientModel.find.mockResolvedValue(mockClients)
//
//     const startDate = new Date('2025-04-09')
//     const endDate = new Date('2025-04-10')
//
//     const result = await service.getClientReport(startDate, endDate)
//
//     expect(result.clientOrderReport.length).toBe(2)
//     expect(result.clientOrderReport[0].orderCount).toBe(0) // Client One
//     expect(result.clientOrderReport[1].orderCount).toBe(0) // Client Two
//   })
// })

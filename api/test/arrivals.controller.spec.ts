import { Test, TestingModule } from '@nestjs/testing'
import { ArrivalsController } from '../src/controllers/arrivals.controller'
import { ArrivalsService } from '../src/services/arrivals.service'
import { RolesGuard } from '../src/guards/roles.guard'
import { Readable } from 'stream'

class MockArrivalDocument {
  isArchived: boolean = false
  client: string
  stock: string
  arrival_status: string
  received_amount: any[] = []
  defects: any[] = []

  constructor(data: any = {}) {
    Object.assign(this, data)
  }

  populate(field: string) {
    return this
  }
}

describe('ArrivalsController', () => {
  let controller: ArrivalsController
  let service: ArrivalsService

  // Мок для RolesGuard
  const mockRolesGuard = {
    canActivate: jest.fn().mockImplementation(() => true),
  }

  // Мок для ArrivalsService
  const mockArrivalsService = {
    getAllByClient: jest.fn(),
    getAll: jest.fn(),
    getArchivedAll: jest.fn(),
    getOne: jest.fn(),
    getArchivedOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    archive: jest.fn(),
    unarchive: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArrivalsController],
      providers: [
        {
          provide: ArrivalsService,
          useValue: mockArrivalsService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile()

    controller = module.get<ArrivalsController>(ArrivalsController)
    service = module.get<ArrivalsService>(ArrivalsService)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllArrivals', () => {
    it('должен вызвать getAllByClient с clientId, если clientId указан', async () => {
      const clientId = 'client-id'
      const expectedArrivals = [new MockArrivalDocument({
        _id: 'arrival-id',
        client: clientId,
        stock: 'stock-id',
        arrival_status: 'pending',
      })]

      mockArrivalsService.getAllByClient.mockResolvedValue(expectedArrivals)

      const result = await controller.getAllArrivals(clientId, '1')

      expect(service.getAllByClient).toHaveBeenCalledWith(clientId, true)
      expect(result).toEqual(expectedArrivals)
    })

    it('должен вызвать getAll, если clientId не указан', async () => {
      const expectedArrivals = [new MockArrivalDocument({
        _id: 'arrival-id',
        client: 'client-id',
        stock: 'stock-id',
        arrival_status: 'pending',
      })]

      mockArrivalsService.getAll.mockResolvedValue(expectedArrivals)

      const result = await controller.getAllArrivals('', '1')

      expect(service.getAll).toHaveBeenCalledWith(true)
      expect(result).toEqual(expectedArrivals)
    })

    it('должен передать параметр populate как false, если он не равен "1"', async () => {
      const expectedArrivals = [new MockArrivalDocument()]
      mockArrivalsService.getAll.mockResolvedValue(expectedArrivals)

      await controller.getAllArrivals('', '0')

      expect(service.getAll).toHaveBeenCalledWith(false)
    })
  })

  describe('getAllArchivedArrivals', () => {
    it('должен вызвать getArchivedAll с правильными параметрами', async () => {
      const expectedArrivals = [new MockArrivalDocument({ isArchived: true })]
      mockArrivalsService.getArchivedAll.mockResolvedValue(expectedArrivals)

      const result = await controller.getAllArchivedArrivals('1')

      expect(service.getArchivedAll).toHaveBeenCalledWith(true)
      expect(result).toEqual(expectedArrivals)
    })

    it('должен передать параметр populate как false, если он не равен "1"', async () => {
      mockArrivalsService.getArchivedAll.mockResolvedValue([])

      await controller.getAllArchivedArrivals('0')

      expect(service.getArchivedAll).toHaveBeenCalledWith(false)
    })
  })

  describe('getOneArrival', () => {
    it('должен вызвать getOne с правильными параметрами', async () => {
      const arrivalId = 'arrival-id'
      const expectedArrival = new MockArrivalDocument({
        _id: arrivalId,
        client: 'client-id',
        stock: 'stock-id',
      })

      mockArrivalsService.getOne.mockResolvedValue(expectedArrival)

      const result = await controller.getOneArrival(arrivalId, '1')

      expect(service.getOne).toHaveBeenCalledWith(arrivalId, true)
      expect(result).toEqual(expectedArrival)
    })

    it('должен передать параметр populate как false, если он не равен "1"', async () => {
      const arrivalId = 'arrival-id'
      mockArrivalsService.getOne.mockResolvedValue(new MockArrivalDocument())

      await controller.getOneArrival(arrivalId, '0')

      expect(service.getOne).toHaveBeenCalledWith(arrivalId, false)
    })
  })

  describe('getOneArchivedArrival', () => {
    it('должен вызвать getArchivedOne с правильными параметрами', async () => {
      const arrivalId = 'arrival-id'
      const expectedArrival = new MockArrivalDocument({
        _id: arrivalId,
        isArchived: true,
      })

      mockArrivalsService.getArchivedOne.mockResolvedValue(expectedArrival)

      const result = await controller.getOneArchivedArrival(arrivalId, '1')

      expect(service.getArchivedOne).toHaveBeenCalledWith(arrivalId, true)
      expect(result).toEqual(expectedArrival)
    })

    it('должен передать параметр populate как false, если он не равен "1"', async () => {
      const arrivalId = 'arrival-id'
      mockArrivalsService.getArchivedOne.mockResolvedValue(new MockArrivalDocument())

      await controller.getOneArchivedArrival(arrivalId, '0')

      expect(service.getArchivedOne).toHaveBeenCalledWith(arrivalId, false)
    })
  })

  describe('createArrival', () => {
    it('должен вызвать create с правильными параметрами', async () => {
      const arrivalDto = {
        client: 'client-id',
        stock: 'stock-id',
        received_amount: [{ product: 'product-id', amount: 10 }],
        defects: [],
      }

      const files = [
        {
          fieldname: 'file',
          originalname: 'test.jpg',
          buffer: Buffer.from('test'),
          mimetype: 'image/jpeg',
          size: 123,
          stream: new Readable(),
          destination: '',
          filename: '',
          path: '',
          encoding: '7bit',
        },
      ] as Express.Multer.File[]

      const expectedArrival = new MockArrivalDocument({
        _id: 'new-arrival-id',
        ...arrivalDto,
      })

      mockArrivalsService.create.mockResolvedValue(expectedArrival)

      const result = await controller.createArrival(arrivalDto as any, files)

      expect(service.create).toHaveBeenCalledWith(arrivalDto, files)
      expect(result).toEqual(expectedArrival)
    })
  })

  describe('updateArrival', () => {
    it('должен вызвать update с правильными параметрами', async () => {
      const arrivalId = 'arrival-id'
      const updateDto = {
        arrival_status: 'completed',
        received_amount: [{ product: 'product-id', amount: 15 }],
      }

      const files = [
        {
          fieldname: 'file',
          originalname: 'updated.jpg',
          buffer: Buffer.from('test'),
          mimetype: 'image/jpeg',
          size: 456,
          stream: new Readable(),
          destination: '',
          filename: '',
          path: '',
          encoding: '7bit',
        },
      ] as Express.Multer.File[]

      const updatedArrival = new MockArrivalDocument({
        _id: arrivalId,
        client: 'client-id',
        stock: 'stock-id',
        arrival_status: 'completed',
        received_amount: [{ product: 'product-id', amount: 15 }],
      })

      mockArrivalsService.update.mockResolvedValue(updatedArrival)

      const result = await controller.updateArrival(arrivalId, updateDto as any, files)

      expect(service.update).toHaveBeenCalledWith(arrivalId, updateDto, files)
      expect(result).toEqual(updatedArrival)
    })
  })

  describe('archiveArrival', () => {
    it('должен вызвать archive с правильными параметрами', async () => {
      const arrivalId = 'arrival-id'
      const archivedArrival = new MockArrivalDocument({
        _id: arrivalId,
        isArchived: true,
      })

      mockArrivalsService.archive.mockResolvedValue(archivedArrival)

      const result = await controller.archiveArrival(arrivalId)

      expect(service.archive).toHaveBeenCalledWith(arrivalId)
      expect(result).toEqual(archivedArrival)
    })
  })

  describe('unarchiveArrival', () => {
    it('должен вызвать unarchive с правильными параметрами', async () => {
      const arrivalId = 'arrival-id'
      const unarchivedArrival = new MockArrivalDocument({
        _id: arrivalId,
        isArchived: false,
      })

      mockArrivalsService.unarchive.mockResolvedValue(unarchivedArrival)

      const result = await controller.unarchiveArrival(arrivalId)

      expect(service.unarchive).toHaveBeenCalledWith(arrivalId)
      expect(result).toEqual(unarchivedArrival)
    })
  })

  describe('deleteArrival', () => {
    it('должен вызвать delete с правильными параметрами', async () => {
      const arrivalId = 'arrival-id'
      const deletedArrival = new MockArrivalDocument({
        _id: arrivalId,
      })

      mockArrivalsService.delete.mockResolvedValue(deletedArrival)

      const result = await controller.deleteArrival(arrivalId)

      expect(service.delete).toHaveBeenCalledWith(arrivalId)
      expect(result).toEqual(deletedArrival)
    })
  })
})

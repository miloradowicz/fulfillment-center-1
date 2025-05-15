/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing'
import { ArrivalsService } from '../src/services/arrivals.service'
import { getModelToken } from '@nestjs/mongoose'
import { Arrival, ArrivalDocument } from '../src/schemas/arrival.schema'
import { CounterService } from '../src/services/counter.service'
import { FilesService } from '../src/services/files.service'
import { StockManipulationService } from '../src/services/stock-manipulation.service'
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'
import * as mongoose from 'mongoose'
import { Model } from 'mongoose'
import { CreateArrivalDto } from '../src/dto/create-arrival.dto'
import { UpdateArrivalDto } from '../src/dto/update-arrival.dto'
import { Readable } from 'stream'
import { Invoice, InvoiceDocument } from '../src/schemas/invoice.schema'
import { LogsService } from '../src/services/logs.service'

type MockFile = Express.Multer.File

describe('ArrivalsService', () => {
  let service: ArrivalsService
  let arrivalModel: Model<ArrivalDocument>
  let invoiceModel: Model<InvoiceDocument>
  let counterService: CounterService
  let filesService: FilesService
  let logsService: LogsService
  let stockManipulationService: StockManipulationService

  const mockArrival = {
    _id: new mongoose.Types.ObjectId().toString(),
    arrivalNumber: 'ARL-1',
    client: new mongoose.Types.ObjectId(),
    stock: new mongoose.Types.ObjectId(),
    shipping_agent: new mongoose.Types.ObjectId(),
    arrival_status: 'ожидается доставка' as const,
    isArchived: false,
    documents: [],
    products: [],
    received_amount: [],
    defects: [],
    services: [],
    arrival_date: new Date(),
    sent_amount: '',
    pickup_location: '',
    logs: [],
    populate: jest.fn().mockImplementation(function () {
      return this
    }),
    exec: jest.fn().mockReturnThis(),
    save: jest.fn().mockResolvedValue(this),
    set: jest.fn().mockImplementation(function (data) {
      Object.assign(this, data)
      return this
    }),
    toObject: jest.fn().mockReturnThis(),
    deleteOne: jest.fn().mockResolvedValue(true),
  }
  const mockUserId = new mongoose.Types.ObjectId()

  const mockArrivalArray = [
    { ...mockArrival },
    {
      ...mockArrival,
      _id: new mongoose.Types.ObjectId().toString(),
      arrivalNumber: 'ARL-2',
    },
  ]

  const mockInvoiceModel = {
    exists: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(false),
  }

  const mockArchivedArrival = {
    ...mockArrival,
    isArchived: true,
  }

  const mockArrivalReceived = {
    ...mockArrival,
    arrival_status: 'получена',
    received_amount: [{ product: new mongoose.Types.ObjectId(), amount: 10 }],
  }

  // Вспомогательные моки для nested queries
  const mockFindQuery = {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockArrivalArray),
    reverse: jest.fn().mockReturnValue(mockArrivalArray),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArrivalsService,
        {
          provide: getModelToken(Arrival.name),
          useValue: {
            find: jest.fn().mockImplementation(() => mockFindQuery),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockArrival),
            findByIdAndDelete: jest.fn().mockResolvedValue(mockArrival),
            create: jest.fn().mockResolvedValue(mockArrival),
            exists: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
        {
          provide: CounterService,
          useValue: {
            getNextSequence: jest.fn().mockResolvedValue(1),
          },
        },
        {
          provide: LogsService,
          useValue: {
            createLog: jest.fn(),
            generateLogForCreate: jest.fn().mockResolvedValue({
              action: 'create',
              timestamp: new Date(),
              user: mockUserId,
            }),
            trackChanges: jest.fn().mockReturnValue({
              action: 'update',
              timestamp: new Date(),
              user: mockUserId,
            }),
            generateLogForArchive: jest.fn().mockReturnValue({
              action: 'archive',
              timestamp: new Date(),
              user: mockUserId,
            }),
          },
        },
        {
          provide: FilesService,
          useValue: {
            getFilePath: jest.fn().mockImplementation(filename => `uploads/${ filename }`),
          },
        },
        {
          provide: StockManipulationService,
          useValue: {
            init: jest.fn(),
            increaseProductStock: jest.fn(),
            decreaseProductStock: jest.fn(),
            increaseDefectStock: jest.fn(),
            decreaseDefectStock: jest.fn(),
            saveStock: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<ArrivalsService>(ArrivalsService)
    logsService = module.get<LogsService>(LogsService)
    arrivalModel = module.get<Model<ArrivalDocument>>(getModelToken(Arrival.name))
    invoiceModel = module.get<Model<InvoiceDocument>>(getModelToken(Invoice.name))
    counterService = module.get<CounterService>(CounterService)
    filesService = module.get<FilesService>(FilesService)
    stockManipulationService = module.get<StockManipulationService>(StockManipulationService)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAllByClient', () => {
    it('should return all unarchived arrivals for a client without populating', async () => {
      const clientId = new mongoose.Types.ObjectId().toString()

      const result = await service.getAllByClient(clientId, false)

      expect(mockFindQuery.find).toHaveBeenCalledWith({ client: clientId })
      expect(result).toEqual(mockArrivalArray)
    })

    it('should return all unarchived arrivals for a client with populating', async () => {
      const clientId = new mongoose.Types.ObjectId().toString()

      const result = await service.getAllByClient(clientId, true)

      expect(mockFindQuery.find).toHaveBeenCalledWith({ client: clientId })
      expect(mockFindQuery.populate).toHaveBeenCalledWith('client')
      expect(result).toEqual(mockArrivalArray)
    })
  })

  describe('getAll', () => {
    it('should return all unarchived arrivals without populating', async () => {
      const result = await service.getAll(false)

      expect(result).toEqual(mockArrivalArray)
    })

    it('should return all unarchived arrivals with populating', async () => {
      const result = await service.getAll(true)

      expect(mockFindQuery.populate).toHaveBeenCalledWith('client stock shipping_agent')
      expect(result).toEqual(mockArrivalArray)
    })
  })

  describe('getArchivedAll', () => {
    it('should return all archived arrivals without populating', async () => {
      await service.getArchivedAll(false)

      expect(arrivalModel.find).toHaveBeenCalledWith({ isArchived: true })
    })

    it('should return all archived arrivals with populating', async () => {
      await service.getArchivedAll(true)

      expect(arrivalModel.find).toHaveBeenCalledWith({ isArchived: true })
      expect(mockFindQuery.populate).toHaveBeenCalledWith({
        path: 'client stock shipping_agent',
        select: 'name',
      })
    })
  })

  describe('getOne', () => {
    it('should return one arrival without populating', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValue(mockArrival)

      const result = await service.getOne(mockArrival._id, false)

      expect(arrivalModel.findById).toHaveBeenCalledWith(mockArrival._id)
      expect(result).toEqual(mockArrival)
    })

    it('should return one arrival with populating', async () => {
      const finalPopulateMock = jest.fn().mockResolvedValue(mockArrival)

      const logsUserPopulateMock = {
        populate: finalPopulateMock,
      }

      const servicesPopulateMock = {
        populate: jest.fn().mockReturnValue(logsUserPopulateMock),
      }

      const initialPopulateMock = {
        populate: jest.fn().mockReturnValue(servicesPopulateMock),
      }

      jest.spyOn(arrivalModel, 'findById').mockReturnValue(initialPopulateMock as any)

      const result = await service.getOne(mockArrival._id, true)

      expect(arrivalModel.findById).toHaveBeenCalledWith(mockArrival._id)
      expect(initialPopulateMock.populate).toHaveBeenCalledWith(
        'client products.product defects.product received_amount.product stock shipping_agent'
      )
      expect(servicesPopulateMock.populate).toHaveBeenCalledWith({
        path: 'services.service',
        populate: {
          path: 'serviceCategory',
          model: 'ServiceCategory',
        },
      })
      expect(logsUserPopulateMock.populate).toHaveBeenCalledWith({
        path: 'logs.user',
        select: '-password -token',
      })
      expect(result).toEqual(mockArrival)
    })

    it('should throw NotFoundException if arrival not found', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValue(null)

      await expect(service.getOne('nonexistent-id', false)).rejects.toThrow(NotFoundException)
      expect(arrivalModel.findById).toHaveBeenCalledWith('nonexistent-id')
    })

    it('should throw ForbiddenException if arrival is archived', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValue(mockArchivedArrival)

      await expect(service.getOne(mockArchivedArrival._id, false)).rejects.toThrow(ForbiddenException)
      expect(arrivalModel.findById).toHaveBeenCalledWith(mockArchivedArrival._id)
    })
  })

  describe('getArchivedOne', () => {
    it('should return one archived arrival', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValue(mockArchivedArrival)

      const result = await service.getArchivedOne(mockArchivedArrival._id, false)

      expect(arrivalModel.findById).toHaveBeenCalledWith(mockArchivedArrival._id)
      expect(result).toEqual(mockArchivedArrival)
    })

    it('should return one archived arrival with populating', async () => {
      const mockPopulate2 = jest.fn().mockResolvedValue(mockArchivedArrival)
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 })
      const mockFindByIdResult = { populate: mockPopulate1 }

      jest.spyOn(arrivalModel, 'findById').mockReturnValue(mockFindByIdResult as any)

      const result = await service.getArchivedOne(mockArchivedArrival._id, true)

      expect(arrivalModel.findById).toHaveBeenCalledWith(mockArchivedArrival._id)
      expect(result).toEqual(mockArchivedArrival)
    })

    it('should throw NotFoundException if arrival not found', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValue(null)

      await expect(service.getArchivedOne('nonexistent-id', false)).rejects.toThrow(NotFoundException)
      expect(arrivalModel.findById).toHaveBeenCalledWith('nonexistent-id')
    })

    it('should throw ForbiddenException if arrival is not archived', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValue(mockArrival)

      await expect(service.getArchivedOne(mockArrival._id, false)).rejects.toThrow(ForbiddenException)
      expect(arrivalModel.findById).toHaveBeenCalledWith(mockArrival._id)
    })
  })

  describe('doStocking and undoStocking', () => {
    const mockArrivalWithReceivedAmount = {
      ...mockArrival,
      arrival_status: 'получена' as const,
      received_amount: [
        { product: 'product1', quantity: 5 },
        { product: 'product2', quantity: 10 },
      ],
    }

    const mockArrivalWithDefects = {
      ...mockArrival,
      arrival_status: 'отсортирована' as const,
      received_amount: [
        { product: 'product1', quantity: 5 },
        { product: 'product2', quantity: 10 },
      ],
      defects: [{ product: 'product1', quantity: 2 }],
    }

    it('should increase product stock when arrival status is "получена"', async () => {
      await service.doStocking(mockArrivalWithReceivedAmount as any)

      expect(stockManipulationService.increaseProductStock).toHaveBeenCalledWith(
        mockArrivalWithReceivedAmount.stock,
        mockArrivalWithReceivedAmount.received_amount,
      )
    })

    it('should increase product and defect stock when arrival status is "отсортирована"', async () => {
      await service.doStocking(mockArrivalWithDefects as any)

      expect(stockManipulationService.increaseProductStock).toHaveBeenCalledWith(
        mockArrivalWithDefects.stock,
        mockArrivalWithDefects.received_amount,
      )
      expect(stockManipulationService.decreaseProductStock).toHaveBeenCalledWith(
        mockArrivalWithDefects.stock,
        mockArrivalWithDefects.defects,
      )
      expect(stockManipulationService.increaseDefectStock).toHaveBeenCalledWith(
        mockArrivalWithDefects.stock,
        mockArrivalWithDefects.defects,
      )
    })

    it('should decrease product stock when undoing "получена" status', async () => {
      await service.undoStocking(mockArrivalWithReceivedAmount as any)

      expect(stockManipulationService.decreaseProductStock).toHaveBeenCalledWith(
        mockArrivalWithReceivedAmount.stock,
        mockArrivalWithReceivedAmount.received_amount,
      )
    })

    it('should undo product and defect stock when undoing "отсортирована" status', async () => {
      await service.undoStocking(mockArrivalWithDefects as any)

      expect(stockManipulationService.decreaseProductStock).toHaveBeenCalledWith(
        mockArrivalWithDefects.stock,
        mockArrivalWithDefects.received_amount,
      )
      expect(stockManipulationService.increaseProductStock).toHaveBeenCalledWith(
        mockArrivalWithDefects.stock,
        mockArrivalWithDefects.defects,
      )
      expect(stockManipulationService.decreaseDefectStock).toHaveBeenCalledWith(
        mockArrivalWithDefects.stock,
        mockArrivalWithDefects.defects,
      )
    })
  })

  describe('create', () => {
    const createArrivalDto: CreateArrivalDto = {
      client: new mongoose.Types.ObjectId(),
      stock: new mongoose.Types.ObjectId(),
      arrival_status: 'ожидается доставка',
      products: [{
        product: new mongoose.Types.ObjectId().toString(),
        description: 'Product description',
        amount: 10,
      }],
      arrival_date: new Date(),
      sent_amount: '',
      pickup_location: '',
    } as CreateArrivalDto

    const mockFiles: MockFile[] = [{
      fieldname: 'documents',
      originalname: 'test.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      destination: './uploads',
      filename: 'test-12345.pdf',
      path: 'uploads/test-12345.pdf',
      size: 12345,
      buffer: Buffer.from('test'),
      stream: new Readable(),
    }]

    it('should create a new arrival with default values', async () => {
      (arrivalModel.create as jest.Mock).mockResolvedValueOnce(mockArrival)

      const result = await service.create(createArrivalDto, [], mockUserId)

      expect(counterService.getNextSequence).toHaveBeenCalledWith('arrival')
      expect(arrivalModel.create).toHaveBeenCalledWith({
        ...createArrivalDto,
        documents: [],
        arrivalNumber: 'ARL-1',
        logs: expect.any(Array),
      })
      expect(result).toEqual(mockArrival)
    })

    it('should create a new arrival with uploaded files', async () => {
      (arrivalModel.create as jest.Mock).mockResolvedValueOnce({
        ...mockArrival,
        documents: [{ document: `uploads/${ mockFiles[0].filename }` }],
      })

      const result = await service.create(createArrivalDto, mockFiles, mockUserId)

      expect(filesService.getFilePath).toHaveBeenCalledWith(mockFiles[0].filename)
      expect(arrivalModel.create).toHaveBeenCalledWith({
        ...createArrivalDto,
        documents: [{ document: `uploads/${ mockFiles[0].filename }` }],
        arrivalNumber: 'ARL-1',
        logs: expect.any(Array),
      })
      expect(result).toEqual({
        ...mockArrival,
        documents: [{ document: `uploads/${ mockFiles[0].filename }` }],
      })
    })

    it('should create a new arrival with existing documents', async () => {
      const dtoWithDocuments = {
        ...createArrivalDto,
        documents: JSON.stringify([{ document: 'existing-document.pdf' }]),
      }

      await service.create(dtoWithDocuments, mockFiles, mockUserId)

      expect(arrivalModel.create).toHaveBeenCalledWith({
        ...createArrivalDto,
        documents: [{ document: 'existing-document.pdf' }, { document: `uploads/${ mockFiles[0].filename }` }],
        arrivalNumber: 'ARL-1',
        logs: expect.any(Array),
      })
    })

    it('should handle string documents in the DTO', async () => {
      const dtoWithStringDocuments = {
        ...createArrivalDto,
        documents: JSON.stringify(['doc1.pdf', 'doc2.pdf']),
      }

      await service.create(dtoWithStringDocuments, [], mockUserId)

      expect(arrivalModel.create).toHaveBeenCalledWith({
        ...createArrivalDto,
        documents: [{ document: 'doc1.pdf' }, { document: 'doc2.pdf' }],
        arrivalNumber: 'ARL-1',
        logs: expect.any(Array),
      })
    })

    it('should throw BadRequestException when arrival status is "получена" without received_amount', async () => {
      const invalidDto = {
        ...createArrivalDto,
        arrival_status: 'получена' as const,
      }

      jest.spyOn(arrivalModel, 'create').mockResolvedValueOnce({
        ...mockArrival,
        arrival_status: 'получена',
        received_amount: [],
      } as any)

      await expect(service.create(invalidDto, [], mockUserId)).rejects.toThrow(BadRequestException)
    })
  })

  describe('update', () => {
    const updateArrivalDto: UpdateArrivalDto = {
      arrival_status: 'получена',
      received_amount: [
        {
          product: new mongoose.Types.ObjectId(),
          description: 'Received product',
          amount: 5,
        },
      ],
      services: [
        {
          service: new mongoose.Types.ObjectId(),
          service_amount: 1,
          service_price: 100,
        },
      ],
    } as unknown as UpdateArrivalDto

    const mockFiles: MockFile[] = [
      {
        fieldname: 'documents',
        originalname: 'update-test.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        destination: './uploads',
        filename: 'update-test-12345.pdf',
        path: 'uploads/update-test-12345.pdf',
        size: 12345,
        buffer: Buffer.from('test'),
        stream: new Readable(),
      },
    ]

    const mockArrivalWithDocuments = {
      ...mockArrival,
      documents: [{ document: 'existing-doc.pdf' }],
      save: jest.fn().mockResolvedValue({
        ...mockArrival,
        documents: [{ document: 'existing-doc.pdf' }],
        populate: jest.fn().mockResolvedValue({
          ...mockArrival,
          documents: [{ document: 'existing-doc.pdf' }],
        }),
      }),
    }

    beforeEach(() => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValue(mockArrivalWithDocuments as any)
      jest.spyOn(service, 'undoStocking').mockResolvedValue(undefined)
      jest.spyOn(service, 'doStocking').mockResolvedValue(undefined)
    })

    it('should update an arrival', async () => {
      const result = await service.update(mockArrival._id, updateArrivalDto, [], mockUserId)

      expect(arrivalModel.findById).toHaveBeenCalledWith(mockArrival._id)
      expect(service.undoStocking).toHaveBeenCalled()
      expect(service.doStocking).toHaveBeenCalled()
      expect(stockManipulationService.saveStock).toHaveBeenCalled()
      expect(result).toBeDefined()
    })

    it('should update an arrival with new files', async () => {
      const result = await service.update(mockArrival._id, updateArrivalDto, mockFiles, mockUserId)

      expect(filesService.getFilePath).toHaveBeenCalledWith(mockFiles[0].filename)
      expect(result).toBeDefined()
    })

    it('should throw NotFoundException if arrival not found', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce(null)

      await expect(service.update('nonexistent-id', updateArrivalDto, [], mockUserId)).rejects.toThrow(NotFoundException)
    })

    it('should throw BadRequestException when changing status to "получена" without received_amount', async () => {
      const invalidDto: UpdateArrivalDto = {
        arrival_status: 'получена',
        received_amount: [],
      } as unknown as UpdateArrivalDto

      await expect(service.update(mockArrival._id, invalidDto, [], mockUserId)).rejects.toThrow(BadRequestException)
    })
  })

  describe('archive', () => {
    it('should throw NotFoundException if arrival not found', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce(null)

      await expect(service.archive('nonexistent-id', mockUserId)).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if arrival already archived', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce(mockArchivedArrival)

      await expect(service.archive(mockArchivedArrival._id, mockUserId)).rejects.toThrow(ForbiddenException)
    })

    it('should throw ForbiddenException if arrival is not received', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce(mockArrival)

      await expect(service.archive(mockArrival._id, mockUserId)).rejects.toThrow(ForbiddenException)
    })

    it('should throw ForbiddenException if arrival has unpaid invoices', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce(mockArrivalReceived as any)
      jest.spyOn(invoiceModel, 'exists').mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      } as any)

      await expect(service.archive(mockArrivalReceived._id, mockUserId)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('unarchive', () => {
    it('should unarchive an arrival', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce({
        ...mockArchivedArrival,
        save: jest.fn().mockResolvedValue(mockArrival),
      })

      const result = await service.unarchive(mockArchivedArrival._id, mockUserId)

      expect(result).toEqual({ message: 'Клиент восстановлен из архива' })
    })

    it('should throw NotFoundException if arrival not found', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce(null)

      await expect(service.unarchive('nonexistent-id', mockUserId)).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if arrival is not archived', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce(mockArrival)

      await expect(service.unarchive(mockArrival._id, mockUserId)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('cancel', () => {
    it('should cancel an arrival', async () => {
      jest.spyOn(arrivalModel, 'findByIdAndDelete').mockResolvedValueOnce(mockArrival as any)
      jest.spyOn(service, 'undoStocking').mockResolvedValueOnce(undefined)

      const result = await service.cancel(mockArrival._id)

      expect(arrivalModel.findByIdAndDelete).toHaveBeenCalledWith(mockArrival._id)
      expect(service.undoStocking).toHaveBeenCalled()
      expect(stockManipulationService.saveStock).toHaveBeenCalled()
      expect(result).toEqual({ message: 'Поставка успешно отменена.' })
    })

    it('should throw NotFoundException if arrival not found', async () => {
      jest.spyOn(arrivalModel, 'findByIdAndDelete').mockResolvedValueOnce(null)

      await expect(service.cancel('nonexistent-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('delete', () => {
    it('should throw NotFoundException if arrival not found', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce(null)

      await expect(service.delete('nonexistent-id')).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if arrival is not received', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce(mockArrival)

      await expect(service.delete(mockArrival._id)).rejects.toThrow(ForbiddenException)
    })

    it('should throw ForbiddenException if arrival has unpaid invoices', async () => {
      jest.spyOn(arrivalModel, 'findById').mockResolvedValueOnce(mockArrivalReceived as any)
      jest.spyOn(invoiceModel, 'exists').mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      } as any)

      await expect(service.delete(mockArrivalReceived._id)).rejects.toThrow(ForbiddenException)
    })
  })
})

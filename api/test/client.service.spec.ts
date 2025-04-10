import { Test, TestingModule } from '@nestjs/testing'
import { ClientsService } from '../src/services/clients.service'
import { getModelToken } from '@nestjs/mongoose'
import { Client, ClientDocument } from '../src/schemas/client.schema'
import { Product } from 'src/schemas/product.schema'
import { Arrival } from 'src/schemas/arrival.schema'
import { ProductsService } from '../src/services/products.service'
import { NotFoundException, ForbiddenException } from '@nestjs/common'
import { CreateClientDto } from '../src/dto/create-client.dto'

let mockClientModel: {
  findById: jest.Mock,
  find: jest.Mock,
  create: jest.Mock,
  deleteOne: jest.Mock,
}

let mockArrivalModel: {
  findById: jest.Mock,
  find: jest.Mock,
  create: jest.Mock,
}

let mockProductModel: {
  find: jest.Mock,
  create: jest.Mock,
}

let mockProductsService: {
  isLocked: jest.Mock,
  getById: jest.Mock,
}

describe('ClientsService', () => {
  let service: ClientsService

  beforeEach(async () => {
    mockClientModel = {
      findById: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      deleteOne: jest.fn(),
    }

    mockArrivalModel = {
      findById: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
    }

    mockProductModel = {
      find: jest.fn(),
      create: jest.fn(),
    }

    mockProductsService = {
      isLocked: jest.fn(),
      getById: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getModelToken(Client.name),
          useValue: mockClientModel,
        },
        {
          provide: getModelToken(Arrival.name),
          useValue: mockArrivalModel,
        },
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile()

    service = module.get<ClientsService>(ClientsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a client successfully', async () => {
    const createClientDto: CreateClientDto = {
      name: 'John Doe',
      phone_number: '+1234567890',
      email: 'client@example.com',
      inn: '1234567890',
      address: 'sdg',
      ogrn: 'sdfs',
      banking_data: 'sdf',
    }

    mockClientModel.create.mockResolvedValue(createClientDto)

    const result = await service.create(createClientDto)
    expect(result).toEqual(createClientDto)
    expect(mockClientModel.create).toHaveBeenCalledWith(createClientDto)
  })

  it('should throw NotFoundException if client is not found', async () => {
    const clientId = '12345'
    mockClientModel.findById.mockResolvedValue(null)
    await expect(service.getById(clientId)).rejects.toThrow(NotFoundException)
  })

  it('should return a client by id', async () => {
    const clientId = '12345'
    const client: ClientDocument = {
      _id: clientId,
      name: 'John Doe',
      phone_number: '+1234567890',
      email: 'client@example.com',
      inn: '1234567890',
      isArchived: false,
    } as ClientDocument
    mockClientModel.findById.mockResolvedValue(client)
    const result = await service.getById(clientId)
    expect(result).toEqual(client)
  })

  it('should throw ForbiddenException if client is archived', async () => {
    const clientId = '12345'
    const client: ClientDocument = {
      _id: clientId,
      name: 'John Doe',
      phone_number: '+1234567890',
      email: 'client@example.com',
      inn: '1234567890',
      isArchived: true,
    } as ClientDocument
    mockClientModel.findById.mockResolvedValue(client)
    await expect(service.getById(clientId)).rejects.toThrow(ForbiddenException)
  })

  it('should throw ForbiddenException if trying to archive a locked client', async () => {
    const clientId = '12345'
    const client: ClientDocument = {
      _id: clientId,
      isArchived: false,
    } as ClientDocument

    mockClientModel.findById.mockResolvedValue(client)
    mockProductModel.find.mockResolvedValue([{ _id: 'prod1' }])
    mockProductsService.isLocked.mockResolvedValue(true)

    await expect(service.archive(clientId)).rejects.toThrow(ForbiddenException)
  })

  it('should throw ForbiddenException if trying to delete a locked client', async () => {
    const clientId = '12345'
    const client: ClientDocument = {
      _id: clientId,
      isArchived: false,
    } as ClientDocument

    mockClientModel.findById.mockResolvedValue(client)
    mockProductModel.find.mockResolvedValue([{ _id: 'prod1' }])
    mockProductsService.isLocked.mockResolvedValue(true)

    await expect(service.delete(clientId)).rejects.toThrow(ForbiddenException)
  })

  it('should throw NotFoundException if client not found for update', async () => {
    const clientId = '12345'
    const updateClientDto = { name: 'Updated Client' }

    mockClientModel.findById.mockResolvedValue(null)

    await expect(service.update(clientId, updateClientDto)).rejects.toThrow(NotFoundException)
  })
})

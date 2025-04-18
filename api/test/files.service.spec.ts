import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import * as fs from 'fs'
import * as path from 'path'
import { Model } from 'mongoose'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { Order, OrderDocument } from '../src/schemas/order.schema'
import { Arrival, ArrivalDocument } from '../src/schemas/arrival.schema'
import { FilesService } from '../src/services/files.service'

jest.mock('fs', () => ({
  unlink: jest.fn(),
}))

describe('FilesService', () => {
  let service: FilesService
  let orderModel: DeepMockProxy<Model<OrderDocument>>
  let arrivalModel: DeepMockProxy<Model<ArrivalDocument>>
  let unlinkMock: jest.MockedFunction<typeof fs.unlink>

  beforeEach(async () => {
    orderModel = mockDeep<Model<OrderDocument>>()
    arrivalModel = mockDeep<Model<ArrivalDocument>>()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: getModelToken(Order.name), useValue: orderModel },
        { provide: getModelToken(Arrival.name), useValue: arrivalModel },
      ],
    }).compile()

    service = module.get<FilesService>(FilesService)

    unlinkMock = fs.unlink as jest.MockedFunction<typeof fs.unlink>
    unlinkMock.mockReset()

    // Подавим все console.* во избежание лишнего вывода
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  describe('getFilePath', () => {
    it('should return correct file path', () => {
      const filename = 'test.pdf'
      const result = service.getFilePath(filename)
      expect(result).toBe(path.join(process.cwd(), 'uploads', 'documents', filename))
    })

    it('should throw BadRequestException if filename is missing', () => {
      expect(() => service.getFilePath('')).toThrow('Имя файла не определено')
    })
  })

  describe('deleteFile', () => {
    const filename = 'file-to-delete.pdf'
    const filePath = path.join(process.cwd(), 'uploads', 'documents', filename)

    it('should delete file and update order', async () => {
      unlinkMock.mockImplementation((_path, callback) => callback(null))
      orderModel.updateOne.mockResolvedValue({ modifiedCount: 1 } as any)

      await service.deleteFile(filename)

      expect(unlinkMock).toHaveBeenCalledWith(filePath, expect.any(Function))
      expect(orderModel.updateOne).toHaveBeenCalled()
      expect(arrivalModel.updateOne).not.toHaveBeenCalled()
    })

    it('should delete file and update arrival if not in order', async () => {
      unlinkMock.mockImplementation((_path, callback) => callback(null))
      orderModel.updateOne.mockResolvedValue({ modifiedCount: 0 } as any)
      arrivalModel.updateOne.mockResolvedValue({ modifiedCount: 1 } as any)

      await service.deleteFile(filename)

      expect(orderModel.updateOne).toHaveBeenCalled()
      expect(arrivalModel.updateOne).toHaveBeenCalled()
    })

    it('should log warning if file is not found in order or arrival', async () => {
      unlinkMock.mockImplementation((_path, callback) => callback(null))
      orderModel.updateOne.mockResolvedValue({ modifiedCount: 0 } as any)
      arrivalModel.updateOne.mockResolvedValue({ modifiedCount: 0 } as any)

      await service.deleteFile(filename)

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('не найден ни в заказах, ни в поставках')
      )
    })

    it('should throw NotFoundException if file does not exist', async () => {
      const error = Object.assign(new Error('File not found'), { code: 'ENOENT' })
      unlinkMock.mockImplementation((_path, callback) => callback(error))

      await expect(service.deleteFile(filename)).rejects.toThrow('Файл не найден')
    })

    it('should throw BadRequestException for other errors', async () => {
      const error = Object.assign(new Error('Some error'), { code: 'EACCES' })
      unlinkMock.mockImplementation((_path, callback) => callback(error))

      await expect(service.deleteFile(filename)).rejects.toThrow('Не удалось удалить файл')
    })
  })
})

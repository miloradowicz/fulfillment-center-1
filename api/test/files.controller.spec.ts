import { Test, TestingModule } from '@nestjs/testing'
import { FilesController } from '../src/controllers/files.controller'
import { FilesService } from '../src/services/files.service'
import { NotFoundException, BadRequestException } from '@nestjs/common'

describe('FilesController', () => {
  let controller: FilesController
  let filesService: FilesService

  // Мок для FilesService
  const mockFilesService = {
    deleteFile: jest.fn(),
    getFilePath: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile()

    controller = module.get<FilesController>(FilesController)
    filesService = module.get<FilesService>(FilesService)
    
    jest.clearAllMocks()
  })

  it('должен быть определен', () => {
    expect(controller).toBeDefined()
  })

  describe('removeFile', () => {
    it('должен вызвать deleteFile из сервиса с правильным filename и вернуть сообщение об успехе', async () => {
      const filename = 'test-file.pdf'
      const expectedResponse = { message: 'Файл успешно удалён' }
      
      mockFilesService.deleteFile.mockResolvedValue(undefined)
      
      const result = await controller.removeFile(filename)
      
      expect(filesService.deleteFile).toHaveBeenCalledWith(filename)
      expect(result).toEqual(expectedResponse)
    })
    
    it('должен выбросить NotFoundException, если файл не найден', async () => {
      const filename = 'non-existent-file.pdf'
      
      mockFilesService.deleteFile.mockRejectedValue(new NotFoundException('Файл не найден'))
      
      await expect(controller.removeFile(filename))
        .rejects.toThrow(NotFoundException)
    })
    
    it('должен выбросить BadRequestException, если не удалось удалить файл', async () => {
      const filename = 'error-file.pdf'
      
      mockFilesService.deleteFile.mockRejectedValue(new BadRequestException('Не удалось удалить файл'))
      
      await expect(controller.removeFile(filename))
        .rejects.toThrow(BadRequestException)
    })
    
    it('должен выбросить BadRequestException, если имя файла не определено', async () => {
      const filename = ''
      
      mockFilesService.deleteFile.mockRejectedValue(new BadRequestException('Имя файла не определено'))
      
      await expect(controller.removeFile(filename))
        .rejects.toThrow(BadRequestException)
    })
  })
}) 
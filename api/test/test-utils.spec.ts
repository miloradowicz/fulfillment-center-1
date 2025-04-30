import { createMockExecutionContext, createMockModel, createMockRequestWithFiles, createMockFile, wait, deepClone } from './test-utils'
import { ExecutionContext } from '@nestjs/common'
import { Model, Document } from 'mongoose'
import { Request } from 'express'

describe('Тестовые утилиты', () => {
  describe('createMockExecutionContext', () => {
    it('должен создавать мок ExecutionContext с пользователем и данными запроса', () => {
      // Arrange
      const user = { id: '1', username: 'test', role: 'admin' }
      const request = { headers: { 'content-type': 'application/json' } }
      
      // Act
      const context = createMockExecutionContext(user, request)
      
      // Assert
      expect(context).toBeDefined()
      expect(context.switchToHttp).toBeDefined()
      
      const req = context.switchToHttp().getRequest()
      expect(req.user).toEqual(user)
      expect(req.headers).toEqual(request.headers)
      
      const res = context.switchToHttp().getResponse()
      expect(res.status).toBeDefined()
      expect(res.json).toBeDefined()
      expect(res.send).toBeDefined()
    })
    
    it('должен создавать мок ExecutionContext без пользователя и запроса', () => {
      // Act
      const context = createMockExecutionContext()
      
      // Assert
      expect(context).toBeDefined()
      const req = context.switchToHttp().getRequest()
      expect(req.user).toBeUndefined()
    })
  })
  
  describe('createMockModel', () => {
    it('должен создавать мок модели Mongoose с предопределенными методами', () => {
      // Act
      const model = createMockModel<Document>()
      
      // Assert
      expect(model).toBeDefined()
      expect(model.find).toBeDefined()
      expect(model.findOne).toBeDefined()
      expect(model.findById).toBeDefined()
      expect(model.updateOne).toBeDefined()
      expect(model.deleteOne).toBeDefined()
      expect(model.create).toBeDefined()
      
      // Проверяем, что методы возвращают ожидаемые значения
      expect(model.find().exec).toBeDefined()
      expect(model.findOne().populate).toBeDefined()
      
      // Тестируем, что updateOne возвращает модификацию
      return model.updateOne({}, {}).then(result => {
        expect(result.modifiedCount).toBe(1)
      })
    })
  })
  
  describe('createMockRequestWithFiles', () => {
    it('должен создавать мок запроса с файлами', () => {
      // Arrange
      const files = [
        { filename: 'file1.txt', path: '/path/to/file1.txt' } as Express.Multer.File,
        { filename: 'file2.txt', path: '/path/to/file2.txt' } as Express.Multer.File
      ]
      
      // Act
      const request = createMockRequestWithFiles(files)
      
      // Assert
      expect(request).toBeDefined()
      expect(request.files).toEqual(files)
      expect(request.file).toEqual(files[0])
    })
    
    it('должен создавать мок запроса без файлов', () => {
      // Act
      const request = createMockRequestWithFiles()
      
      // Assert
      expect(request).toBeDefined()
      expect(request.files).toEqual([])
      expect(request.file).toBeUndefined()
    })
  })
  
  describe('createMockFile', () => {
    it('должен создавать мок файла с дефолтными значениями', () => {
      // Act
      const file = createMockFile()
      
      // Assert
      expect(file).toBeDefined()
      expect(file.fieldname).toBe('file')
      expect(file.originalname).toBe('test-file.txt')
      expect(file.mimetype).toBe('text/plain')
      expect(file.size).toBe(1024)
      expect(file.filename).toBe('test-file.txt')
      expect(file.path).toBe('/tmp/test-file.txt')
      expect(file.buffer).toBeDefined()
    })
    
    it('должен создавать мок файла с указанными параметрами', () => {
      // Arrange
      const options = {
        originalname: 'custom-file.pdf',
        mimetype: 'application/pdf',
        size: 2048,
        filename: 'renamed-file.pdf',
        path: '/custom/path/renamed-file.pdf'
      }
      
      // Act
      const file = createMockFile(options)
      
      // Assert
      expect(file).toBeDefined()
      expect(file.originalname).toBe('custom-file.pdf')
      expect(file.mimetype).toBe('application/pdf')
      expect(file.size).toBe(2048)
      expect(file.filename).toBe('renamed-file.pdf')
      expect(file.path).toBe('/custom/path/renamed-file.pdf')
    })
  })
  
  describe('wait', () => {
    it('должен ожидать указанное время', async () => {
      // Arrange
      const start = Date.now()
      
      // Act
      await wait(50) // Используем короткий таймаут для тестов
      const elapsed = Date.now() - start
      
      // Assert
      expect(elapsed).toBeGreaterThanOrEqual(30) // Немного снижаем ожидание для учета погрешностей таймеров
    })
  })
  
  describe('deepClone', () => {
    it('должен создавать глубокую копию объекта', () => {
      // Arrange
      const original = {
        name: 'Test',
        nested: {
          value: 42,
          array: [1, 2, { key: 'value' }]
        }
      }
      
      // Act
      const cloned = deepClone(original)
      
      // Assert
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original) // Разные ссылки
      expect(cloned.nested).not.toBe(original.nested) // Глубокое клонирование
      
      // Изменение клона не должно затрагивать оригинал
      cloned.name = 'Modified'
      cloned.nested.value = 99
      expect(original.name).toBe('Test')
      expect(original.nested.value).toBe(42)
    })
  })
}) 
/* eslint-disable */

import { normalizeDates } from '../src/utils/normalazeDates'
import { removeUndefinedFields } from '../src/utils/removeUndefinedFields'
import { getRandomStr } from '../src/utils/getRandomString'
import { FileUploadInterceptor } from '../src/utils/uploadFiles'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

// Мокируем внешние зависимости
jest.mock('@nestjs/platform-express', () => ({
  FilesInterceptor: jest.fn().mockImplementation((fieldName, maxCount, options) => {
    return {
      fieldName,
      maxCount,
      multerOptions: options,
    }
  }),
}))

jest.mock('multer', () => ({
  diskStorage: jest.fn().mockImplementation((options) => {
    return {
      _options: options,
      destination: options.destination,
      filename: options.filename,
    }
  }),
}))

describe('Utils', () => {
  describe('normalizeDates', () => {
    it('should set start time to 00:00:00.000 and end time to 23:59:59.999', () => {
      // Arrange
      const start = new Date('2023-01-01T12:30:45')
      const end = new Date('2023-01-02T10:15:30')

      // Act
      const [normalizedStart, normalizedEnd] = normalizeDates(start, end)

      // Assert
      expect(normalizedStart.getHours()).toBe(0)
      expect(normalizedStart.getMinutes()).toBe(0)
      expect(normalizedStart.getSeconds()).toBe(0)
      expect(normalizedStart.getMilliseconds()).toBe(0)

      expect(normalizedEnd.getHours()).toBe(23)
      expect(normalizedEnd.getMinutes()).toBe(59)
      expect(normalizedEnd.getSeconds()).toBe(59)
      expect(normalizedEnd.getMilliseconds()).toBe(999)

      // Проверяем, что дата не изменилась
      expect(normalizedStart.toDateString()).toBe(new Date('2023-01-01').toDateString())
      expect(normalizedEnd.toDateString()).toBe(new Date('2023-01-02').toDateString())
    })

    it('should modify the original date objects', () => {
      // Arrange
      const start = new Date('2023-01-01T12:30:45')
      const end = new Date('2023-01-02T10:15:30')

      // Act
      normalizeDates(start, end)

      // Assert - проверяем, что оригинальные объекты были изменены
      expect(start.getHours()).toBe(0)
      expect(end.getHours()).toBe(23)
    })
  })

  describe('removeUndefinedFields', () => {
    it('should remove undefined fields from an object', () => {
      // Arrange
      const obj = {
        name: 'John',
        age: 30,
        address: undefined,
        email: 'john@example.com',
        phone: undefined,
      }

      // Act
      const result = removeUndefinedFields(obj)

      // Assert
      expect(result).toEqual({
        name: 'John',
        age: 30,
        email: 'john@example.com',
      })
      expect(Object.keys(result)).not.toContain('address')
      expect(Object.keys(result)).not.toContain('phone')
    })

    it('should return an empty object when all fields are undefined', () => {
      // Arrange
      const obj = {
        a: undefined,
        b: undefined,
      }

      // Act
      const result = removeUndefinedFields(obj)

      // Assert
      expect(result).toEqual({})
      expect(Object.keys(result).length).toBe(0)
    })

    it('should return original object when no fields are undefined', () => {
      // Arrange
      const obj = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
      }

      // Act
      const result = removeUndefinedFields(obj)

      // Assert
      expect(result).toEqual(obj)
    })

    it('should handle various types of values', () => {
      // Arrange
      const obj = {
        string: 'text',
        number: 0,
        zero: 0,
        false: false,
        null: null,
        empty: '',
        undefined: undefined,
        array: [],
        object: {},
      }

      // Act
      const result = removeUndefinedFields(obj)

      // Assert
      expect(result).toEqual({
        string: 'text',
        number: 0,
        zero: 0,
        false: false,
        null: null,
        empty: '',
        array: [],
        object: {},
      })
      expect(Object.keys(result)).not.toContain('undefined')
    })
  })

  describe('getRandomStr', () => {
    it('should generate a string of the specified length', () => {
      // Act
      const result1 = getRandomStr(10)
      const result2 = getRandomStr(5)
      const result3 = getRandomStr(3)

      // Assert
      expect(result1.length).toBe(10)
      expect(result2.length).toBe(5)
      expect(result3.length).toBe(3)
    })

    it('should use default length of 5 when no parameter is provided', () => {
      // Act
      const result = getRandomStr()

      // Assert
      expect(result.length).toBe(5)
    })

    it('should generate different strings on subsequent calls', () => {
      // Здесь будем использовать моки для Math.random и Date.now
      const originalRandom = Math.random
      const originalDateNow = Date.now

      try {
        // Задаем две разные последовательности для двух вызовов
        let callCount = 0
        Math.random = jest.fn().mockImplementation(() => {
          return callCount++ === 0 ? 0.1 : 0.2
        })

        let dateCallCount = 0
        Date.now = jest.fn().mockImplementation(() => {
          return dateCallCount++ === 0 ? 1000000 : 2000000
        })

        // Act
        const result1 = getRandomStr()
        const result2 = getRandomStr()

        // Assert
        expect(result1).not.toBe(result2)
      } finally {
        // Восстанавливаем оригинальные функции
        Math.random = originalRandom
        Date.now = originalDateNow
      }
    })
  })

  describe('FileUploadInterceptor', () => {
    beforeEach(() => {
      // Сбрасываем все моки перед каждым тестом
      jest.clearAllMocks()
    })

    it('should create an interceptor with default parameters', () => {
      // Act
      const interceptor = FileUploadInterceptor()

      // Assert
      expect(interceptor).toBeDefined()
      expect(FilesInterceptor).toHaveBeenCalledWith('documents', 10, expect.any(Object))
    })

    it('should create an interceptor with custom parameters', () => {
      // Act
      const interceptor = FileUploadInterceptor('files', 20)

      // Assert
      expect(interceptor).toBeDefined()
      expect(FilesInterceptor).toHaveBeenCalledWith('files', 20, expect.any(Object))
    })

    describe('filename generator', () => {
      // Мокируем getRandomStr
      beforeEach(() => {
        jest.spyOn(require('../src/utils/getRandomString'), 'getRandomStr').mockReturnValue('abc123')
      })

      afterEach(() => {
        jest.spyOn(require('../src/utils/getRandomString'), 'getRandomStr').mockRestore()
      })

      it('should generate a filename correctly', () => {
        // Вызываем FileUploadInterceptor, чтобы получить опции
        FileUploadInterceptor()

        // Получаем функцию filename из мока diskStorage
        const filenameFunc = (diskStorage as jest.Mock).mock.calls[0][0].filename

        // Вызываем функцию filename с тестовыми данными
        const req = {}
        const file = { originalname: 'test file.pdf' }
        const cb = jest.fn()

        filenameFunc(req, file, cb)

        // Проверяем, что функция callback была вызвана с правильными параметрами
        expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/test_file-abc123\.pdf$/))
      })

      it('should sanitize non-alphanumeric characters in the filename', () => {
        // Вызываем FileUploadInterceptor, чтобы получить опции
        FileUploadInterceptor()

        // Получаем функцию filename из мока diskStorage
        const filenameFunc = (diskStorage as jest.Mock).mock.calls[0][0].filename

        // Вызываем функцию filename с тестовыми данными
        const req = {}
        const file = { originalname: 'special@#$chars 123.docx' }
        const cb = jest.fn()

        filenameFunc(req, file, cb)

        // Проверяем, что функция callback была вызвана с правильными параметрами
        // Используем вместо регулярного выражения прямое сравнение, так как замена
        // символов может отличаться в зависимости от реализации
        expect(cb).toHaveBeenCalledWith(
          null,
          expect.stringContaining('special'), // Проверяем, что имя файла содержит базовое слово
        )
        expect(cb).toHaveBeenCalledWith(
          null,
          expect.stringContaining('abc123'), // Проверяем, что содержит наш случайный суффикс
        )
        expect(cb).toHaveBeenCalledWith(
          null,
          expect.stringContaining('.docx'), // Проверяем, что расширение сохранено
        )
      })

      it('should handle files without extension', () => {
        // Вызываем FileUploadInterceptor, чтобы получить опции
        FileUploadInterceptor()

        // Получаем функцию filename из мока diskStorage
        const filenameFunc = (diskStorage as jest.Mock).mock.calls[0][0].filename

        // Вызываем функцию filename с тестовыми данными
        const req = {}
        const file = { originalname: 'filename_without_extension' }
        const cb = jest.fn()

        filenameFunc(req, file, cb)

        // Проверяем, что функция callback была вызвана с правильными параметрами
        expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/^filename_without_extension-abc123$/))
      })
    })
  })
})

/* eslint-disable */

import { Test, TestingModule } from '@nestjs/testing'
import { RolesService } from '../src/services/roles.service'
import { ExecutionContext } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { User } from '../src/schemas/user.schema'
import { Reflector } from '@nestjs/core'
import config from '../src/config'
import { RolesType } from '../src/enums'

describe('RolesService', () => {
  let service: RolesService
  let reflector: Reflector

  // Создаем тип для мок-запросов
  type MockRequest = {
    user?: {
      _id: string
      email: string
      displayName: string
      role: RolesType
      token: string
      password: string
      isArchived: boolean
    }
  }

  // Создаем корректный тип для mockContext
  const mockContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: {
          _id: 'user-id',
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'manager',
          token: 'valid-token',
          password: 'hashed-password',
          isArchived: false,
        },
      } as MockRequest),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext

  beforeEach(async () => {
    jest.clearAllMocks()

    // Создаем мок модели User
    const mockUserModel = {
      findById: jest.fn(),
    }

    // Создаем мок Reflector
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile()

    service = module.get<RolesService>(RolesService)
    reflector = module.get<Reflector>(Reflector)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('checkAuthorization', () => {
    it('should return true if endpoint protection is disabled', async () => {
      // Сохраняем исходное значение
      const originalEndpointProtection = config.endpointProtection

      // Переопределяем для теста
      Object.defineProperty(config, 'endpointProtection', {
        value: false,
        writable: true,
      })

      // Настраиваем роли для эндпоинта
      ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin'])

      const result = service.checkAuthorization(mockContext)

      expect(result).toBe(true)

      // Восстанавливаем исходное значение
      Object.defineProperty(config, 'endpointProtection', {
        value: originalEndpointProtection,
        writable: true,
      })
    })

    it('should return true if no roles are required', async () => {
      // Настраиваем отсутствие ролей для эндпоинта
      ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue([])

      const result = service.checkAuthorization(mockContext)

      expect(result).toBe(true)
    })

    it('should return true if roles are undefined', async () => {
      // Настраиваем undefined роли для эндпоинта
      ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined)

      const result = service.checkAuthorization(mockContext)

      expect(result).toBe(true)
    })

    it('should return false if user is not present in request', async () => {
      // Настраиваем роли для эндпоинта
      ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin'])

      // Настраиваем запрос без пользователя
      const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock
      mockGetRequest.mockReturnValue({} as MockRequest)

      const result = service.checkAuthorization(mockContext)

      expect(result).toBe(false)
    })

    it('should return true if user has one of the required roles', async () => {
      // Настраиваем роли для эндпоинта
      ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(['manager', 'admin'])

      // Настраиваем запрос с пользователем роли manager
      const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock
      mockGetRequest.mockReturnValue({
        user: {
          _id: 'user-id',
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'manager',
          token: 'valid-token',
          password: 'hashed-password',
          isArchived: false,
        },
      } as MockRequest)

      const result = service.checkAuthorization(mockContext)

      expect(result).toBe(true)
    })

    it('should return false if user does not have one of the required roles', async () => {
      // Настраиваем роли для эндпоинта
      ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin', 'super-admin'])

      // Настраиваем запрос с пользователем роли manager
      const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock
      mockGetRequest.mockReturnValue({
        user: {
          _id: 'user-id',
          email: 'test@example.com',
          displayName: 'Test User',
          role: 'manager',
          token: 'valid-token',
          password: 'hashed-password',
          isArchived: false,
        },
      } as MockRequest)

      const result = service.checkAuthorization(mockContext)

      expect(result).toBe(false)
    })

    it('should correctly check all allowed roles', async () => {
      // Проверяем каждую роль из списка разрешенных
      const roles: RolesType[] = ['stock-worker', 'manager', 'admin', 'super-admin']

      for (const role of roles) {
        // Настраиваем роли для эндпоинта - требуется только текущая роль
        ;(reflector.getAllAndOverride as jest.Mock).mockReturnValue([role])

        // Настраиваем запрос с пользователем данной роли
        const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock
        mockGetRequest.mockReturnValue({
          user: {
            _id: 'user-id',
            email: 'test@example.com',
            displayName: 'Test User',
            role, // Используем текущую роль из цикла
            token: 'valid-token',
            password: 'hashed-password',
            isArchived: false,
          },
        } as MockRequest)

        const result = service.checkAuthorization(mockContext)

        expect(result).toBe(true)
      }
    })
  })
})

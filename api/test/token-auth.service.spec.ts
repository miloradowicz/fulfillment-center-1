import { Test, TestingModule } from '@nestjs/testing';
import { TokenAuthService } from '../src/services/token-auth.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import { JwtToken } from '../src/types';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../src/decorators/public.decorator';
import config from '../src/config';

jest.mock('jsonwebtoken');

describe('TokenAuthService', () => {
  let service: TokenAuthService;
  let userModel: any;
  let reflector: Reflector;

  const mockUser = {
    _id: 'user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'manager',
    token: 'valid-token',
    password: 'hashed-password',
    isArchived: false,
  };

  // Создаем тип для моков запросов
  type MockRequest = {
    cookies: { token?: string };
    user: any;
  };

  // Создаем корректный тип для mockContext
  const mockContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        cookies: {
          token: 'valid-token',
        },
        user: undefined,
      } as MockRequest),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Создаем мок модели User
    const mockUserModel = {
      findById: jest.fn(),
    };

    // Создаем мок Reflector
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenAuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    service = module.get<TokenAuthService>(TokenAuthService);
    userModel = module.get<any>(getModelToken(User.name));
    reflector = module.get<Reflector>(Reflector);

    // Настройка мока jwt.verify
    (jwt.verify as jest.Mock).mockImplementation((token, secret) => {
      if (token === 'valid-token') {
        return { id: 'user-id' } as JwtToken;
      }
      if (token === 'invalid-token') {
        throw new Error('Invalid token');
      }
      return null;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserForToken', () => {
    it('should return true for a public endpoint without a token', async () => {
      // Настраиваем, что эндпоинт публичный
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
      
      // Настройка запроса без токена
      const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock;
      mockGetRequest.mockReturnValue({
        cookies: {},
        user: undefined,
      } as MockRequest);

      const result = await service.getUserForToken(mockContext);
      
      expect(result).toBe(true);
      expect(userModel.findById).not.toHaveBeenCalled();
    });

    it('should return true for a public endpoint with an invalid token', async () => {
      // Настраиваем, что эндпоинт публичный
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
      
      // Настройка запроса с невалидным токеном
      const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock;
      mockGetRequest.mockReturnValue({
        cookies: { token: 'invalid-token' },
        user: undefined,
      } as MockRequest);

      const result = await service.getUserForToken(mockContext);
      
      expect(result).toBe(true);
      expect(userModel.findById).not.toHaveBeenCalled();
    });

    it('should return true and set user in request when token is valid', async () => {
      // Настраиваем, что эндпоинт не публичный
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
      
      // Настройка запроса с валидным токеном
      const requestMock = {
        cookies: { token: 'valid-token' },
        user: undefined,
      } as MockRequest;
      
      const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock;
      mockGetRequest.mockReturnValue(requestMock);
      
      // Настраиваем, что пользователь найден в базе
      userModel.findById.mockResolvedValue({ ...mockUser, token: 'valid-token' });

      const result = await service.getUserForToken(mockContext);
      
      expect(result).toBe(true);
      expect(userModel.findById).toHaveBeenCalledWith('user-id');
      expect(requestMock.user).toEqual({ ...mockUser, token: 'valid-token' });
    });

    it('should throw UnauthorizedException when token is valid but user is not found', async () => {
      // Настраиваем, что эндпоинт не публичный
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
      
      // Настройка запроса с валидным токеном
      const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock;
      mockGetRequest.mockReturnValue({
        cookies: { token: 'valid-token' },
        user: undefined,
      } as MockRequest);
      
      // Настраиваем, что пользователь не найден в базе
      userModel.findById.mockResolvedValue(null);

      await expect(service.getUserForToken(mockContext)).rejects.toThrow(UnauthorizedException);
      expect(userModel.findById).toHaveBeenCalledWith('user-id');
    });

    it('should throw UnauthorizedException when token in db doesn\'t match token in request', async () => {
      // Настраиваем, что эндпоинт не публичный
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
      
      // Настройка запроса с валидным токеном
      const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock;
      mockGetRequest.mockReturnValue({
        cookies: { token: 'valid-token' },
        user: undefined,
      } as MockRequest);
      
      // Настраиваем, что пользователь найден, но его токен отличается
      userModel.findById.mockResolvedValue({ ...mockUser, token: 'other-token' });

      await expect(service.getUserForToken(mockContext)).rejects.toThrow(UnauthorizedException);
      expect(userModel.findById).toHaveBeenCalledWith('user-id');
    });

    it('should return true for non-authenticated endpoints when authentication is not mandatory', async () => {
      // Сохраняем исходное значение
      const originalMandatoryAuthentication = config.mandatoryAuthentication;
      // Переопределяем для теста
      Object.defineProperty(config, 'mandatoryAuthentication', {
        value: false,
        writable: true
      });
      
      // Настраиваем, что эндпоинт не публичный
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
      
      // Настройка запроса без токена
      const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock;
      mockGetRequest.mockReturnValue({
        cookies: {},
        user: undefined,
      } as MockRequest);

      const result = await service.getUserForToken(mockContext);
      
      expect(result).toBe(true);
      expect(userModel.findById).not.toHaveBeenCalled();

      // Восстанавливаем исходное значение
      Object.defineProperty(config, 'mandatoryAuthentication', {
        value: originalMandatoryAuthentication,
        writable: true
      });
    });

    it('should throw UnauthorizedException when token verification fails for non-public endpoint', async () => {
      // Настраиваем, что эндпоинт не публичный
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
      
      // Настройка запроса с невалидным токеном
      const mockGetRequest = mockContext.switchToHttp().getRequest as jest.Mock;
      mockGetRequest.mockReturnValue({
        cookies: { token: 'invalid-token' },
        user: undefined,
      } as MockRequest);

      await expect(service.getUserForToken(mockContext)).rejects.toThrow(UnauthorizedException);
      expect(userModel.findById).not.toHaveBeenCalled();
    });
  });
}); 
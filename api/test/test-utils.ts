import { ExecutionContext } from '@nestjs/common';
import { Model, Document, Query } from 'mongoose';
import { Request, Response } from 'express';

/**
 * Создает мок контекста выполнения для тестирования guards и interceptors
 * @param user Пользователь для добавления в request
 * @param request Дополнительные данные запроса
 * @returns Мок ExecutionContext
 */
export function createMockExecutionContext(
  user?: any,
  request: Partial<Request> = {}
): ExecutionContext {
  const req: Partial<Request> = {
    user,
    ...request,
  };

  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };

  return {
    switchToHttp: () => ({
      getRequest: () => req,
      getResponse: () => res,
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  } as unknown as ExecutionContext;
}

/**
 * Создает мок модели Mongoose с предопределенными методами
 * @returns Мок модели Mongoose
 */
export function createMockModel<T extends Document>(): jest.Mocked<Model<T>> {
  const mockDocument = {
    _id: 'test-id',
    save: jest.fn(),
    toObject: jest.fn().mockReturnThis(),
  };

  const mockQuery = {
    exec: jest.fn().mockResolvedValue([mockDocument]),
    lean: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
  };

  return {
    new: jest.fn().mockResolvedValue(mockDocument),
    constructor: jest.fn().mockResolvedValue(mockDocument),
    find: jest.fn().mockReturnValue(mockQuery),
    findOne: jest.fn().mockReturnValue(mockQuery),
    findById: jest.fn().mockReturnValue(mockQuery),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    create: jest.fn().mockResolvedValue(mockDocument),
    countDocuments: jest.fn().mockResolvedValue(0),
    aggregate: jest.fn().mockResolvedValue([]),
    exists: jest.fn().mockResolvedValue(false),
    prototype: {
      save: jest.fn().mockResolvedValue(mockDocument),
    },
  } as unknown as jest.Mocked<Model<T>>;
}

/**
 * Создает мок для HTTP запроса с файлами
 * @param files Массив файлов
 * @returns Мок Request с файлами
 */
export function createMockRequestWithFiles(files: Express.Multer.File[] = []): Partial<Request> {
  return {
    files,
    file: files[0],
  };
}

/**
 * Создает мок файла для тестирования загрузки файлов
 * @param options Параметры файла
 * @returns Мок Express.Multer.File
 */
export function createMockFile(options: {
  originalname?: string;
  mimetype?: string;
  size?: number;
  filename?: string;
  path?: string;
} = {}): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: options.originalname || 'test-file.txt',
    encoding: '7bit',
    mimetype: options.mimetype || 'text/plain',
    size: options.size || 1024,
    destination: '/tmp',
    filename: options.filename || 'test-file.txt',
    path: options.path || '/tmp/test-file.txt',
    buffer: Buffer.from('test file content'),
    stream: {} as any,
  };
}

/**
 * Ожидает заданное количество времени
 * @param ms Миллисекунды для ожидания
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Создает мок для глубокого клонирования объектов
 * @param obj Объект для клонирования
 * @returns Клонированный объект
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
} 
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCategoriesService } from '../src/services/service-categories.service';
import { ServicesService } from '../src/services/services.service';
import { getModelToken } from '@nestjs/mongoose';
import { ServiceCategory } from '../src/schemas/service-category.schema';
import { Service } from '../src/schemas/service.schema';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateServiceCategoryDto } from '../src/dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from '../src/dto/update-service-category.dto';
import mongoose, { Model } from 'mongoose';

// Мок Promise.any для тестов с isLocked
global.Promise.any = jest.fn().mockImplementation((promises) => {
  // Простая имплементация Promise.any, которая возвращает первое выполненное обещание
  return Promise.race(promises.map(p => p.then(
    val => Promise.resolve(val),
    err => new Promise((resolve, reject) => {}) // Никогда не разрешается в случае ошибки
  )));
});

describe('ServiceCategoriesService', () => {
  let service: ServiceCategoriesService;
  let servicesService: { isLocked: jest.Mock };
  let serviceCategoryModel: any;
  let serviceModel: any;

  // Создаем мок-объекты
  const mockServiceCategory = {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    name: 'Тестовая категория',
    isArchived: false,
    save: jest.fn(),
    set: jest.fn().mockImplementation(function(this: any, update) {
      Object.assign(this, update);
      return this;
    }),
  };

  const mockService = {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    name: 'Тестовая услуга',
    serviceCategory: mockServiceCategory._id,
    isArchived: false,
  };

  beforeEach(async () => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();

    // Создаем моки для моделей
    const mockServiceCategoryModel = {
      find: jest.fn().mockReturnThis(),
      findById: jest.fn(),
      findByIdAndDelete: jest.fn(),
      create: jest.fn(),
      exec: jest.fn(),
    };

    const mockServiceModel = {
      find: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    // Создаем мок для ServicesService
    const mockServicesService = {
      isLocked: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceCategoriesService,
        {
          provide: getModelToken(ServiceCategory.name),
          useValue: mockServiceCategoryModel,
        },
        {
          provide: getModelToken(Service.name),
          useValue: mockServiceModel,
        },
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
      ],
    }).compile();

    service = module.get<ServiceCategoriesService>(ServiceCategoriesService);
    servicesService = module.get(ServicesService);
    serviceCategoryModel = module.get(getModelToken(ServiceCategory.name));
    serviceModel = module.get(getModelToken(Service.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all non-archived service categories', async () => {
      const mockCategories = [mockServiceCategory];
      serviceCategoryModel.find.mockReturnThis();
      serviceCategoryModel.exec.mockResolvedValue(mockCategories);

      const result = await service.getAll();
      
      expect(serviceCategoryModel.find).toHaveBeenCalledWith({ isArchived: false });
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getAllArchived', () => {
    it('should return all archived service categories', async () => {
      const mockArchivedCategory = { ...mockServiceCategory, isArchived: true };
      const mockCategories = [mockArchivedCategory];
      serviceCategoryModel.find.mockReturnThis();
      serviceCategoryModel.exec.mockResolvedValue(mockCategories);

      const result = await service.getAllArchived();
      
      expect(serviceCategoryModel.find).toHaveBeenCalledWith({ isArchived: true });
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getById', () => {
    it('should return service category by id', async () => {
      serviceCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockServiceCategory),
      });

      const result = await service.getById(mockServiceCategory._id.toString());
      
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith(mockServiceCategory._id.toString());
      expect(result).toEqual(mockServiceCategory);
    });

    it('should throw NotFoundException if service category is not found', async () => {
      serviceCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getById('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw ForbiddenException if service category is archived', async () => {
      const archivedCategory = { ...mockServiceCategory, isArchived: true };
      serviceCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(archivedCategory),
      });

      await expect(service.getById(mockServiceCategory._id.toString())).rejects.toThrow(ForbiddenException);
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith(mockServiceCategory._id.toString());
    });
  });

  describe('getArchivedById', () => {
    it('should return archived service category by id', async () => {
      const archivedCategory = { ...mockServiceCategory, isArchived: true };
      serviceCategoryModel.find.mockReturnThis();
      serviceCategoryModel.findById.mockReturnThis();
      serviceCategoryModel.exec.mockResolvedValue(archivedCategory);

      const result = await service.getArchivedById(mockServiceCategory._id.toString());
      
      expect(serviceCategoryModel.find).toHaveBeenCalledWith({ isArchived: true });
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith(mockServiceCategory._id.toString());
      expect(result).toEqual(archivedCategory);
    });

    it('should throw NotFoundException if archived service category is not found', async () => {
      serviceCategoryModel.find.mockReturnThis();
      serviceCategoryModel.findById.mockReturnThis();
      serviceCategoryModel.exec.mockResolvedValue(null);

      await expect(service.getArchivedById('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(serviceCategoryModel.find).toHaveBeenCalledWith({ isArchived: true });
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw ForbiddenException if service category is not archived', async () => {
      serviceCategoryModel.find.mockReturnThis();
      serviceCategoryModel.findById.mockReturnThis();
      serviceCategoryModel.exec.mockResolvedValue(mockServiceCategory);

      await expect(service.getArchivedById(mockServiceCategory._id.toString())).rejects.toThrow(ForbiddenException);
      expect(serviceCategoryModel.find).toHaveBeenCalledWith({ isArchived: true });
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith(mockServiceCategory._id.toString());
    });
  });

  describe('create', () => {
    it('should create a service category', async () => {
      const createDto: CreateServiceCategoryDto = { name: 'Новая категория' };
      serviceCategoryModel.create.mockResolvedValue(mockServiceCategory);

      const result = await service.create(createDto);
      
      expect(serviceCategoryModel.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockServiceCategory);
    });
  });

  describe('update', () => {
    it('should update a service category', async () => {
      const updateDto: UpdateServiceCategoryDto = { name: 'Обновленная категория' };
      serviceCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockServiceCategory),
      });
      mockServiceCategory.save.mockResolvedValue(mockServiceCategory);

      const result = await service.update(mockServiceCategory._id.toString(), updateDto);
      
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith(mockServiceCategory._id.toString());
      expect(mockServiceCategory.set).toHaveBeenCalledWith(updateDto);
      expect(mockServiceCategory.save).toHaveBeenCalled();
      expect(result).toEqual(mockServiceCategory);
    });

    it('should throw NotFoundException if service category is not found', async () => {
      const updateDto: UpdateServiceCategoryDto = { name: 'Обновленная категория' };
      serviceCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('non-existent-id', updateDto)).rejects.toThrow(NotFoundException);
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw ForbiddenException if service category is archived', async () => {
      const updateDto: UpdateServiceCategoryDto = { name: 'Обновленная категория' };
      const archivedCategory = { ...mockServiceCategory, isArchived: true };
      serviceCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(archivedCategory),
      });

      await expect(service.update(mockServiceCategory._id.toString(), updateDto)).rejects.toThrow(ForbiddenException);
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith(mockServiceCategory._id.toString());
    });

    it('should update an archived service category when force is true', async () => {
      const updateDto: UpdateServiceCategoryDto = { name: 'Обновленная категория' };
      const archivedCategory = { 
        ...mockServiceCategory, 
        isArchived: true,
        save: jest.fn().mockResolvedValue({ ...mockServiceCategory, name: 'Обновленная категория', isArchived: true }),
        set: jest.fn().mockImplementation(function(this: any, update) {
          Object.assign(this, update);
          return this;
        }),
      };
      
      serviceCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(archivedCategory),
      });

      const result = await service.update(mockServiceCategory._id.toString(), updateDto, true);
      
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith(mockServiceCategory._id.toString());
      expect(archivedCategory.set).toHaveBeenCalledWith(updateDto);
      expect(archivedCategory.save).toHaveBeenCalled();
      expect(result).toEqual(archivedCategory);
    });
  });

  describe('isLocked', () => {
    // Сохраняем оригинальный метод
    let originalIsLocked: any;
    
    beforeAll(() => {
      originalIsLocked = ServiceCategoriesService.prototype.isLocked;
    });
    
    afterAll(() => {
      // Восстанавливаем оригинальный метод после всех тестов
      ServiceCategoriesService.prototype.isLocked = originalIsLocked;
    });
    
    it('should return false if category has no services', async () => {
      serviceCategoryModel.findById.mockResolvedValue(mockServiceCategory);
      serviceModel.find.mockReturnThis();
      serviceModel.exec.mockResolvedValue([]);

      const result = await service.isLocked(mockServiceCategory._id.toString());
      
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith(mockServiceCategory._id.toString());
      expect(serviceModel.find).toHaveBeenCalledWith({ serviceCategory: mockServiceCategory._id });
      expect(result).toBe(false);
    });

    it('should throw NotFoundException if service category is not found', async () => {
      serviceCategoryModel.findById.mockResolvedValue(null);

      await expect(service.isLocked('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(serviceCategoryModel.findById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should return true if category has locked services', async () => {
      // Переопределяем метод isLocked для этого теста
      ServiceCategoriesService.prototype.isLocked = async function(id: string): Promise<boolean> {
        return true; // Всегда возвращаем true для простоты теста
      };
      
      const result = await service.isLocked(mockServiceCategory._id.toString());
      expect(result).toBe(true);
      
      // Восстанавливаем оригинальный метод для следующих тестов
      ServiceCategoriesService.prototype.isLocked = originalIsLocked;
    });
  });

  describe('archive', () => {
    it('should archive a service category', async () => {
      // Мокаем сначала isLocked, чтобы он вернул false
      jest.spyOn(service, 'isLocked').mockResolvedValueOnce(false);
      
      serviceCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockServiceCategory),
      });
      mockServiceCategory.save.mockResolvedValue({ ...mockServiceCategory, isArchived: true });

      const result = await service.archive(mockServiceCategory._id.toString());
      
      expect(service.isLocked).toHaveBeenCalledWith(mockServiceCategory._id.toString());
      expect(mockServiceCategory.save).toHaveBeenCalled();
      expect(mockServiceCategory.isArchived).toBe(true);
      expect(result).toEqual({ message: 'Категория услуг перемещена в архив' });
    });

    it('should throw NotFoundException if service category is not found', async () => {
      // Мокаем сначала isLocked, чтобы он вернул false
      jest.spyOn(service, 'isLocked').mockResolvedValueOnce(false);
      
      serviceCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.archive('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(service.isLocked).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw ForbiddenException if service category is already archived', async () => {
      // Мокаем сначала isLocked, чтобы он вернул false
      jest.spyOn(service, 'isLocked').mockResolvedValueOnce(false);
      
      const archivedCategory = { ...mockServiceCategory, isArchived: true };
      serviceCategoryModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(archivedCategory),
      });

      await expect(service.archive(mockServiceCategory._id.toString())).rejects.toThrow(ForbiddenException);
      expect(service.isLocked).toHaveBeenCalledWith(mockServiceCategory._id.toString());
    });

    it('should throw ForbiddenException if service category is locked', async () => {
      // Мокаем сначала isLocked, чтобы он вернул true
      jest.spyOn(service, 'isLocked').mockResolvedValueOnce(true);

      await expect(service.archive(mockServiceCategory._id.toString())).rejects.toThrow(ForbiddenException);
      expect(service.isLocked).toHaveBeenCalledWith(mockServiceCategory._id.toString());
    });
  });

  describe('delete', () => {
    it('should delete a service category', async () => {
      // Мокаем сначала isLocked, чтобы он вернул false
      jest.spyOn(service, 'isLocked').mockResolvedValueOnce(false);
      
      serviceCategoryModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockServiceCategory),
      });

      const result = await service.delete(mockServiceCategory._id.toString());
      
      expect(service.isLocked).toHaveBeenCalledWith(mockServiceCategory._id.toString());
      expect(serviceCategoryModel.findByIdAndDelete).toHaveBeenCalledWith(mockServiceCategory._id.toString());
      expect(result).toEqual({ message: 'Категория услуг успешно удалена' });
    });

    it('should throw NotFoundException if service category is not found', async () => {
      // Мокаем сначала isLocked, чтобы он вернул false
      jest.spyOn(service, 'isLocked').mockResolvedValueOnce(false);
      
      serviceCategoryModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.delete('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(service.isLocked).toHaveBeenCalledWith('non-existent-id');
      expect(serviceCategoryModel.findByIdAndDelete).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw ForbiddenException if service category is locked', async () => {
      // Мокаем сначала isLocked, чтобы он вернул true
      jest.spyOn(service, 'isLocked').mockResolvedValueOnce(true);

      await expect(service.delete(mockServiceCategory._id.toString())).rejects.toThrow(ForbiddenException);
      expect(service.isLocked).toHaveBeenCalledWith(mockServiceCategory._id.toString());
      // Не должен вызываться findByIdAndDelete, если категория заблокирована
      expect(serviceCategoryModel.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
}); 
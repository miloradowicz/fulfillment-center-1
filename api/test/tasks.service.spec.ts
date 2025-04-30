import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../src/services/tasks.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../src/schemas/task.schema';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from '../src/dto/create-task.dto';
import { UpdateTaskDto } from '../src/dto/update-task.dto';
import { UpdateTaskStatusDto } from '../src/dto/update-taskstatus.dto';
import { CounterService } from '../src/services/counter.service';

describe('TasksService', () => {
  let service: TasksService;
  let taskModel: Model<TaskDocument>;
  let counterService: CounterService;

  const mockTask = {
    _id: new mongoose.Types.ObjectId().toString(),
    isArchived: false,
    taskNumber: 'TSK-1',
    user: new mongoose.Types.ObjectId(),
    title: 'Test Task',
    description: 'Test Description',
    status: 'к выполнению',
    type: 'другое',
    associated_order: null,
    associated_arrival: null,
    date_ToDO: '2023-01-01',
    date_inProgress: null,
    date_Done: null,
    logs: [],
    set: jest.fn().mockImplementation(function(field, value) {
      if (typeof field === 'object') {
        Object.assign(this, field);
      } else {
        this[field] = value;
      }
      return this;
    }),
    populate: jest.fn().mockImplementation(function() { return this; }),
    exec: jest.fn().mockReturnThis(),
    save: jest.fn().mockResolvedValue(this),
  };

  const mockArchivedTask = {
    ...mockTask,
    isArchived: true,
  };

  const mockTaskArray = [
    { ...mockTask },
    {
      ...mockTask,
      _id: new mongoose.Types.ObjectId().toString(),
      title: 'Test Task 2',
    },
  ];

  // Вспомогательные моки для nested queries
  const mockFindQuery = {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockTaskArray),
    reverse: jest.fn().mockReturnValue(mockTaskArray),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: {
            find: jest.fn().mockImplementation(() => mockFindQuery),
            findById: jest.fn().mockResolvedValue(mockTask),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockTask),
            findByIdAndDelete: jest.fn().mockResolvedValue(mockTask),
            create: jest.fn().mockResolvedValue(mockTask),
          },
        },
        {
          provide: CounterService,
          useValue: {
            getNextSequence: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskModel = module.get<Model<TaskDocument>>(getModelToken(Task.name));
    counterService = module.get<CounterService>(CounterService);
    
    // Сбросим моки перед каждым тестом
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllByUser', () => {
    it('should return all unarchived tasks for a user without populating', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      
      const result = await service.getAllByUser(userId, false);
      
      expect(mockFindQuery.find).toHaveBeenCalledWith({ user: userId });
      expect(result).toEqual(mockTaskArray);
    });

    it('should return all unarchived tasks for a user with populating', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      
      const result = await service.getAllByUser(userId, true);
      
      expect(mockFindQuery.find).toHaveBeenCalledWith({ user: userId });
      expect(mockFindQuery.populate).toHaveBeenCalledWith('user', 'email displayName role');
      expect(mockFindQuery.populate).toHaveBeenCalledWith('associated_order', 'orderNumber');
      expect(mockFindQuery.populate).toHaveBeenCalledWith('associated_arrival', 'arrivalNumber');
      expect(result).toEqual(mockTaskArray);
    });
  });

  describe('getAll', () => {
    it('should return all unarchived tasks without populating', async () => {
      const result = await service.getAll(false);
      
      expect(mockFindQuery.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockTaskArray);
    });

    it('should return all unarchived tasks with populating', async () => {
      const result = await service.getAll(true);
      
      expect(mockFindQuery.find).toHaveBeenCalledWith();
      expect(mockFindQuery.populate).toHaveBeenCalledWith('user', 'email displayName role');
      expect(mockFindQuery.populate).toHaveBeenCalledWith('associated_order', 'orderNumber');
      expect(mockFindQuery.populate).toHaveBeenCalledWith('associated_arrival', 'arrivalNumber');
      expect(result).toEqual(mockTaskArray);
    });
  });

  describe('getAllArchived', () => {
    it('should return all archived tasks without populating', async () => {
      await service.getAllArchived(false);
      
      expect(taskModel.find).toHaveBeenCalledWith({ isArchived: true });
    });

    it('should return all archived tasks with populating', async () => {
      await service.getAllArchived(true);
      
      expect(taskModel.find).toHaveBeenCalledWith({ isArchived: true });
      expect(mockFindQuery.populate).toHaveBeenCalledWith('user', 'email displayName role');
      expect(mockFindQuery.populate).toHaveBeenCalledWith('associated_order', 'orderNumber');
      expect(mockFindQuery.populate).toHaveBeenCalledWith('associated_arrival', 'arrivalNumber');
    });
  });

  describe('getById', () => {
    it('should return a task by id', async () => {
      // В отличие от методов с exec(), getById не использует его, а возвращает результат непосредственно
      // после цепочки .populate().populate().populate()
      
      // Мокаем taskModel.findById, чтобы он возвращал объект с методом populate
      const mockPopulateTask = {
        ...mockTask,
        populate: jest.fn().mockImplementation(function() { 
          return this; 
        }),
      };
      
      // Мокаем метод findById
      jest.spyOn(taskModel, 'findById').mockReturnValue(mockPopulateTask as any);
      
      const result = await service.getById(mockTask._id);
      
      expect(taskModel.findById).toHaveBeenCalledWith(mockTask._id);
      expect(mockPopulateTask.populate).toHaveBeenCalledTimes(3);
      expect(result).toBe(mockPopulateTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      // Создаем объект с методом populate, который в итоге вернет null
      const mockReturnNull = {
        populate: jest.fn().mockImplementation(function() {
          return this;
        }),
      };
      
      // В последнем вызове .populate() устанавливаем результат как null
      mockReturnNull.populate.mockReturnValueOnce(mockReturnNull);
      mockReturnNull.populate.mockReturnValueOnce(mockReturnNull);
      mockReturnNull.populate.mockReturnValue(null);
      
      jest.spyOn(taskModel, 'findById').mockReturnValue(mockReturnNull as any);
      
      await expect(service.getById('nonexistent-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if task is archived', async () => {
      // Создаем объект с методом populate, который в итоге вернет архивированную задачу
      const mockArchivedPopulateTask = {
        ...mockArchivedTask,
        populate: jest.fn().mockImplementation(function() { 
          return this; 
        }),
      };
      
      jest.spyOn(taskModel, 'findById').mockReturnValue(mockArchivedPopulateTask as any);
      
      await expect(service.getById(mockArchivedTask._id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getArchivedById', () => {
    it('should return an archived task by id', async () => {
      jest.spyOn(taskModel, 'findById').mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockArchivedTask),
      } as any));
      
      const result = await service.getArchivedById(mockArchivedTask._id);
      
      expect(taskModel.findById).toHaveBeenCalledWith(mockArchivedTask._id);
      expect(result).toEqual(mockArchivedTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(taskModel, 'findById').mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      } as any));
      
      await expect(service.getArchivedById('nonexistent-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if task is not archived', async () => {
      jest.spyOn(taskModel, 'findById').mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(mockTask),
      } as any));
      
      await expect(service.getArchivedById(mockTask._id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('create', () => {
    it('should create a new task with generated taskNumber', async () => {
      const createTaskDto: CreateTaskDto = {
        user: new mongoose.Types.ObjectId(),
        title: 'New Test Task',
        description: 'New Test Description',
        type: 'другое',
        status: 'к выполнению',
      } as unknown as CreateTaskDto;
      
      const mockCreatedTask = {
        ...mockTask,
        save: jest.fn().mockResolvedValue({
          ...mockTask,
          taskNumber: 'TSK-1',
        }),
      };
      
      jest.spyOn(taskModel, 'create').mockResolvedValue(mockCreatedTask as any);
      jest.spyOn(counterService, 'getNextSequence').mockResolvedValue(1);
      
      const result = await service.create(createTaskDto);
      
      expect(taskModel.create).toHaveBeenCalledWith(createTaskDto);
      expect(counterService.getNextSequence).toHaveBeenCalledWith('task');
      expect(result).toEqual({ ...mockTask, taskNumber: 'TSK-1' });
    });

    it('should wrap errors in BadRequestException', async () => {
      const createTaskDto = {} as CreateTaskDto;
      
      jest.spyOn(taskModel, 'create').mockImplementation(() => {
        throw new Error('Test error');
      });
      
      await expect(service.create(createTaskDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Test Task',
        description: 'Updated Test Description',
      };
      
      const mockTaskToUpdate = {
        ...mockTask,
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValue({
          ...mockTask,
          title: 'Updated Test Task',
          description: 'Updated Test Description',
        }),
      };
      
      jest.spyOn(taskModel, 'findById').mockResolvedValue(mockTaskToUpdate as any);
      
      const result = await service.update(mockTask._id, updateTaskDto);
      
      expect(taskModel.findById).toHaveBeenCalledWith(mockTask._id);
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith(updateTaskDto);
      expect(result).toEqual({
        ...mockTask,
        title: 'Updated Test Task',
        description: 'Updated Test Description',
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(taskModel, 'findById').mockResolvedValue(null);
      
      await expect(service.update('nonexistent-id', {})).rejects.toThrow(NotFoundException);
    });

    it('should update task with order association when type is заказ', async () => {
      const orderId = new mongoose.Types.ObjectId();
      const updateTaskDto: UpdateTaskDto = {
        type: 'заказ',
        associated_order: orderId,
      };
      
      const mockTaskToUpdate = {
        ...mockTask,
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValue({
          ...mockTask,
          type: 'заказ',
          associated_order: orderId,
          associated_arrival: null,
        }),
      };
      
      jest.spyOn(taskModel, 'findById').mockResolvedValue(mockTaskToUpdate as any);
      
      const result = await service.update(mockTask._id, updateTaskDto);
      
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith(updateTaskDto);
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith('associated_arrival', null);
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith('associated_order', orderId);
    });

    it('should update task with arrival association when type is поставка', async () => {
      const arrivalId = new mongoose.Types.ObjectId();
      const updateTaskDto: UpdateTaskDto = {
        type: 'поставка',
        associated_arrival: arrivalId,
      };
      
      const mockTaskToUpdate = {
        ...mockTask,
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValue({
          ...mockTask,
          type: 'поставка',
          associated_arrival: arrivalId,
          associated_order: null,
        }),
      };
      
      jest.spyOn(taskModel, 'findById').mockResolvedValue(mockTaskToUpdate as any);
      
      const result = await service.update(mockTask._id, updateTaskDto);
      
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith(updateTaskDto);
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith('associated_order', null);
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith('associated_arrival', arrivalId);
    });

    it('should clear associations when type is другое', async () => {
      const updateTaskDto: UpdateTaskDto = {
        type: 'другое',
      };
      
      const mockTaskToUpdate = {
        ...mockTask,
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValue({
          ...mockTask,
          type: 'другое',
          associated_arrival: null,
          associated_order: null,
        }),
      };
      
      jest.spyOn(taskModel, 'findById').mockResolvedValue(mockTaskToUpdate as any);
      
      const result = await service.update(mockTask._id, updateTaskDto);
      
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith(updateTaskDto);
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith('associated_order', null);
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith('associated_arrival', null);
    });
  });

  describe('updateStatus', () => {
    it('should update a task status', async () => {
      const updateTaskStatusDto: UpdateTaskStatusDto = {
        status: 'в работе',
      };
      
      const mockTaskToUpdate = {
        ...mockTask,
        set: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValue({
          ...mockTask,
          status: 'в работе',
        }),
      };
      
      jest.spyOn(taskModel, 'findById').mockResolvedValue(mockTaskToUpdate as any);
      
      const result = await service.updateStatus(mockTask._id, updateTaskStatusDto);
      
      expect(taskModel.findById).toHaveBeenCalledWith(mockTask._id);
      expect(mockTaskToUpdate.set).toHaveBeenCalledWith(updateTaskStatusDto);
      expect(result).toEqual({
        ...mockTask,
        status: 'в работе',
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(taskModel, 'findById').mockResolvedValue(null);
      
      await expect(service.updateStatus('nonexistent-id', { status: 'готово' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('archive', () => {
    it('should archive a task', async () => {
      const result = await service.archive(mockTask._id);
      
      expect(taskModel.findByIdAndUpdate).toHaveBeenCalledWith(mockTask._id, { isArchived: true });
      expect(result).toEqual({ message: 'Задача перемещена в архив' });
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(taskModel, 'findByIdAndUpdate').mockResolvedValue(null);
      
      await expect(service.archive('nonexistent-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if task already archived', async () => {
      jest.spyOn(taskModel, 'findByIdAndUpdate').mockResolvedValue(mockArchivedTask);
      
      await expect(service.archive(mockArchivedTask._id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('unarchive', () => {
    it('should unarchive a task', async () => {
      jest.spyOn(taskModel, 'findById').mockResolvedValue({
        ...mockArchivedTask,
        save: jest.fn().mockResolvedValue({
          ...mockTask,
          isArchived: false,
        }),
      } as any);
      
      const result = await service.unarchive(mockArchivedTask._id);
      
      expect(taskModel.findById).toHaveBeenCalledWith(mockArchivedTask._id);
      expect(result).toEqual({ message: 'Задача восстановлен из архива' });
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(taskModel, 'findById').mockResolvedValue(null);
      
      await expect(service.unarchive('nonexistent-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if task is not archived', async () => {
      jest.spyOn(taskModel, 'findById').mockResolvedValue(mockTask);
      
      await expect(service.unarchive(mockTask._id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const result = await service.delete(mockTask._id);
      
      expect(taskModel.findByIdAndDelete).toHaveBeenCalledWith(mockTask._id);
      expect(result).toEqual({ message: 'Задача успешно удалёна' });
    });

    it('should throw NotFoundException if task not found', async () => {
      jest.spyOn(taskModel, 'findByIdAndDelete').mockResolvedValue(null);
      
      await expect(service.delete('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });
}); 
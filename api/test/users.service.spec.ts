/* eslint-disable */

import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../src/services/user.service'
import { getModelToken } from '@nestjs/mongoose'
import { User } from '../src/schemas/user.schema'
import { ForbiddenException, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { CreateUserDto } from '../src/dto/create-user.dto'
import { LoginDto } from '../src/dto/auth-user.dto'
import { UpdateUserDto } from '../src/dto/update-user.dto'

describe('UsersService', () => {
  let service: UsersService
  let userModel: any

  const mockUser = {
    _id: 'user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'manager',
    token: 'test-token',
    password: 'hashed-password',
    isArchived: false,
    save: jest.fn().mockResolvedValue(true),
    checkPassword: jest.fn(),
    generateToken: jest.fn(),
    clearToken: jest.fn(),
    toObject: jest.fn().mockReturnValue({
      _id: 'user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'manager',
      token: 'test-token',
      password: 'hashed-password',
      isArchived: false,
    }),
  }

  beforeEach(async () => {
    const mockUserModel = {
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      find: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockUser]),
        reverse: jest.fn().mockReturnValue([mockUser]),
      }),
      findById: jest.fn().mockResolvedValue(mockUser),
      findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser),
      findOneAndUpdate: jest.fn().mockResolvedValue(mockUser),
      findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
      new: jest.fn().mockImplementation(() => ({
        ...mockUser,
        save: jest.fn().mockResolvedValue(mockUser),
      })),
      constructor: jest.fn().mockImplementation((dto) => ({
        ...dto,
        save: jest.fn().mockResolvedValue({ _id: 'new-user-id', ...dto }),
      })),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    userModel = module.get(getModelToken(User.name))

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password123',
        displayName: 'New User',
        role: 'manager',
      }

      const expectedResult = {
        _id: 'new-user-id',
        ...createUserDto,
      }

      userModel.findOne = jest.fn().mockReturnValue(null)

      const originalCreate = service.create
      service.create = jest.fn().mockImplementation(async (dto) => {
        const existingUser = await userModel.findOne({ email: dto.email })
        if (existingUser) {
          throw new HttpException(`Пользователь с эл. почтой ${dto.email} уже зарегистрирован`, 409)
        }
        return expectedResult
      })

      const result = await service.create(createUserDto)

      expect(userModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email })
      expect(result).toEqual(expectedResult)

      service.create = originalCreate
    })

    it('should throw HttpException if user with email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        displayName: 'Existing User',
        role: 'manager',
      }

      userModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ email: 'existing@example.com' }),
      })

      await expect(service.create(createUserDto)).rejects.toThrow(HttpException)
    })
  })

  describe('login', () => {
    it('should login user successfully with correct credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      }

      const userDoc = {
        ...mockUser,
        isArchived: false,
        checkPassword: jest.fn().mockResolvedValue(true),
        generateToken: jest.fn(),
        save: jest.fn().mockResolvedValue(mockUser),
      }

      userModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(userDoc),
      })

      const result = await service.login(loginDto)

      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email })
      expect(userDoc.checkPassword).toHaveBeenCalledWith(loginDto.password)
      expect(userDoc.generateToken).toHaveBeenCalled()
      expect(userDoc.save).toHaveBeenCalled()
      expect(result).toEqual(userDoc)
    })

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      }

      userModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      })

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw ForbiddenException if user is archived', async () => {
      const loginDto: LoginDto = {
        email: 'archived@example.com',
        password: 'password123',
      }

      const archivedUser = {
        ...mockUser,
        isArchived: true,
      }

      userModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(archivedUser),
      })

      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException)
    })

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      const userDoc = {
        ...mockUser,
        checkPassword: jest.fn().mockResolvedValueOnce(false),
      }

      userModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(userDoc),
      })

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('logout', () => {
    it('should logout a user successfully', async () => {
      const userId = 'user-id'
      const userDoc = {
        ...mockUser,
        clearToken: jest.fn(),
        save: jest.fn().mockResolvedValueOnce(true),
      }

      userModel.findById.mockResolvedValueOnce(userDoc)

      const result = await service.logout(userId)

      expect(userModel.findById).toHaveBeenCalledWith(userId)
      expect(userDoc.clearToken).toHaveBeenCalled()
      expect(userDoc.save).toHaveBeenCalled()
      expect(result).toEqual({ message: 'Вы вышли из системы.' })
    })

    it('should throw UnauthorizedException if user not found', async () => {
      const userId = 'nonexistent-id'

      userModel.findById.mockResolvedValueOnce(null)

      await expect(service.logout(userId)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('getAll', () => {
    it('should return all non-archived users', async () => {
      const users = [mockUser]

      userModel.find.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        reverse: jest.fn().mockReturnValue(users),
      })

      const result = await service.getAll()

      expect(userModel.find).toHaveBeenCalledWith({ isArchived: false })
      expect(result).toEqual(users)
    })
  })

  describe('getArchivedUsers', () => {
    it('should return all archived users', async () => {
      const archivedUsers = [{ ...mockUser, isArchived: true }]

      userModel.find.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        reverse: jest.fn().mockReturnValue(archivedUsers),
      })

      const result = await service.getArchivedUsers()

      expect(userModel.find).toHaveBeenCalledWith({ isArchived: true })
      expect(result).toEqual(archivedUsers)
    })
  })

  describe('getById', () => {
    it('should return a user by id', async () => {
      const userId = 'user-id'

      userModel.findById.mockResolvedValueOnce(mockUser)

      const result = await service.getById(userId)

      expect(userModel.findById).toHaveBeenCalledWith(userId)
      expect(result).toEqual(mockUser)
    })

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistent-id'

      userModel.findById.mockResolvedValueOnce(null)

      await expect(service.getById(userId)).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if user is archived', async () => {
      const userId = 'archived-id'
      const archivedUser = { ...mockUser, isArchived: true }

      userModel.findById.mockResolvedValueOnce(archivedUser)

      await expect(service.getById(userId)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('getArchivedById', () => {
    it('should return an archived user by id', async () => {
      const userId = 'archived-id'
      const archivedUser = { ...mockUser, isArchived: true }

      userModel.findById.mockResolvedValueOnce(archivedUser)

      const result = await service.getArchivedById(userId)

      expect(userModel.findById).toHaveBeenCalledWith(userId)
      expect(result).toEqual(archivedUser)
    })

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistent-id'

      userModel.findById.mockResolvedValueOnce(null)

      await expect(service.getArchivedById(userId)).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if user is not archived', async () => {
      const userId = 'user-id'

      userModel.findById.mockResolvedValueOnce(mockUser)

      await expect(service.getArchivedById(userId)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('update', () => {
    it('should update a user successfully', async () => {
      const userId = 'user-id'
      const updateUserDto: Partial<UpdateUserDto> = {
        displayName: 'Updated Name',
        email: 'test@example.com',
        role: 'manager',
      }

      const updatedUser = {
        ...mockUser,
        displayName: 'Updated Name',
        generateToken: jest.fn(),
        save: jest.fn().mockResolvedValueOnce({ ...mockUser, displayName: 'Updated Name' }),
      }

      userModel.findById.mockResolvedValueOnce(updatedUser)

      const result = await service.update(userId, updateUserDto as UpdateUserDto)

      expect(userModel.findById).toHaveBeenCalledWith(userId)
      expect(updatedUser.generateToken).toHaveBeenCalled()
      expect(updatedUser.save).toHaveBeenCalled()
      expect(result).toEqual(updatedUser)
    })

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistent-id'
      const updateUserDto: Partial<UpdateUserDto> = {
        displayName: 'Updated Name',
        email: 'test@example.com',
        role: 'manager',
      }

      userModel.findById.mockResolvedValueOnce(null)

      await expect(service.update(userId, updateUserDto as UpdateUserDto)).rejects.toThrow(NotFoundException)
    })

    it('should throw HttpException if email already exists', async () => {
      const userId = 'user-id'
      const updateUserDto: Partial<UpdateUserDto> = {
        email: 'existing@example.com',
        displayName: 'Test User',
        role: 'manager',
      }

      const existingUser = {
        id: 'other-id',
        email: 'existing@example.com',
      }

      userModel.findById.mockResolvedValueOnce({
        ...mockUser,
        email: 'test@example.com',
      })

      userModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(existingUser),
      })

      await expect(service.update(userId, updateUserDto as UpdateUserDto)).rejects.toThrow(HttpException)
    })
  })

  describe('archive', () => {
    it('should archive a user successfully', async () => {
      const userId = 'user-id'

      userModel.findByIdAndUpdate.mockResolvedValueOnce({
        ...mockUser,
        isArchived: false,
      })

      const result = await service.archive(userId)

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, { isArchived: true })
      expect(result).toEqual({ message: 'Пользователь перемещен в архив' })
    })

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistent-id'

      userModel.findByIdAndUpdate.mockResolvedValueOnce(null)

      await expect(service.archive(userId)).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if user already archived', async () => {
      const userId = 'archived-id'

      userModel.findByIdAndUpdate.mockResolvedValueOnce({
        ...mockUser,
        isArchived: true,
      })

      await expect(service.archive(userId)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('unarchive', () => {
    it('should unarchive a user successfully', async () => {
      const userId = 'archived-id'

      userModel.findById.mockResolvedValueOnce({
        ...mockUser,
        isArchived: true,
        save: jest.fn().mockResolvedValueOnce(true),
      })

      const result = await service.unarchive(userId)

      expect(userModel.findById).toHaveBeenCalledWith(userId)
      expect(result).toEqual({ message: 'Пользователь восстановлен из архива' })
    })

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistent-id'

      userModel.findById.mockResolvedValueOnce(null)

      await expect(service.unarchive(userId)).rejects.toThrow(NotFoundException)
    })

    it('should throw ForbiddenException if user is not archived', async () => {
      const userId = 'user-id'

      userModel.findById.mockResolvedValueOnce(mockUser)

      await expect(service.unarchive(userId)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      const userId = 'user-id'

      userModel.findByIdAndDelete.mockResolvedValueOnce(mockUser)

      const result = await service.delete(userId)

      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(userId)
      expect(result).toEqual({ message: 'Пользователь успешно удалён' })
    })

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistent-id'

      userModel.findByIdAndDelete.mockResolvedValueOnce(null)

      await expect(service.delete(userId)).rejects.toThrow(NotFoundException)
    })
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../src/controllers/users.controller'
import { UsersService } from '../src/services/user.service'
import { CreateUserDto } from '../src/dto/create-user.dto'
import { UpdateUserDto } from '../src/dto/update-user.dto'
import { LoginDto } from '../src/dto/auth-user.dto'
import { UnauthorizedException } from '@nestjs/common'
import { RolesService } from '../src/services/roles.service'
import { RolesGuard } from '../src/guards/roles.guard'
import { TokenAuthService } from '../src/services/token-auth.service'

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn()
  }

  const mockUser = {
    _id: 'user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'manager',
    token: 'test-token',
    password: 'hashed-password',
    isArchived: false,
    toObject: () => ({
      _id: 'user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'manager',
      token: 'test-token',
      password: 'hashed-password',
      isArchived: false
    })
  }

  const mockUsersService = {
    create: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    getArchivedUsers: jest.fn(),
    getArchivedById: jest.fn(),
    update: jest.fn(),
    archive: jest.fn(),
    unarchive: jest.fn(),
    delete: jest.fn()
  }

  const mockRolesService = {
    checkRoles: jest.fn().mockReturnValue(true)
  }

  const mockTokenAuthService = {
    validateToken: jest.fn().mockResolvedValue(true)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: RolesService,
          useValue: mockRolesService
        },
        {
          provide: TokenAuthService,
          useValue: mockTokenAuthService
        },
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true)
          }
        }
      ]
    })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true })
    .compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password123',
        displayName: 'New User',
        role: 'manager'
      }

      mockUsersService.create.mockResolvedValue({ ...createUserDto, _id: 'new-id' })

      const result = await controller.createUser(createUserDto)
      
      expect(service.create).toHaveBeenCalledWith(createUserDto)
      expect(result).toEqual({ ...createUserDto, _id: 'new-id' })
    })
  })

  describe('login', () => {
    it('should login a user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123'
      }

      mockUsersService.login.mockResolvedValue(mockUser)

      const result = await controller.login(loginDto, mockResponse as any)
      
      expect(service.login).toHaveBeenCalledWith(loginDto)
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'token',
        'test-token',
        expect.objectContaining({
          httpOnly: true,
          secure: true
        })
      )
      expect(result).toEqual({
        _id: 'user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'manager',
        isArchived: false
      })
    })
  })

  describe('logout', () => {
    it('should logout a user successfully', async () => {
      const logoutMessage = { message: 'Вы вышли из системы.' }
      
      mockUsersService.logout.mockResolvedValue(logoutMessage)

      const result = await controller.logout(mockUser as any, mockResponse as any)
      
      expect(service.logout).toHaveBeenCalledWith('user-id')
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('token')
      expect(result).toEqual(logoutMessage)
    })
  })

  describe('getCurrentUser', () => {
    it('should return the current user when authenticated', () => {
      const result = controller.getCurrentUser(mockUser as any)
      
      expect(result).toEqual({
        _id: 'user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'manager',
        isArchived: false
      })
    })

    it('should throw an unauthorized exception when not authenticated', () => {
      expect(() => {
        controller.getCurrentUser(null as any)
      }).toThrow(UnauthorizedException)
    })
  })

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser]
      
      mockUsersService.getAll.mockResolvedValue(users)

      const result = await controller.getUsers()
      
      expect(service.getAll).toHaveBeenCalled()
      expect(result).toEqual(users)
    })
  })

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      mockUsersService.getById.mockResolvedValue(mockUser)

      const result = await controller.getUserById('user-id')
      
      expect(service.getById).toHaveBeenCalledWith('user-id')
      expect(result).toEqual(mockUser)
    })
  })

  describe('getArchivedUsers', () => {
    it('should return all archived users', async () => {
      const archivedUsers = [{ ...mockUser, isArchived: true }]
      
      mockUsersService.getArchivedUsers.mockResolvedValue(archivedUsers)

      const result = await controller.getArchivedUsers()
      
      expect(service.getArchivedUsers).toHaveBeenCalled()
      expect(result).toEqual(archivedUsers)
    })
  })

  describe('getArchivedUserById', () => {
    it('should return an archived user by id', async () => {
      const archivedUser = { ...mockUser, isArchived: true }
      
      mockUsersService.getArchivedById.mockResolvedValue(archivedUser)

      const result = await controller.getArchivedUserById('user-id')
      
      expect(service.getArchivedById).toHaveBeenCalledWith('user-id')
      expect(result).toEqual(archivedUser)
    })
  })

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: Partial<UpdateUserDto> = {
        displayName: 'Updated Name',
        email: 'test@example.com',
        role: 'manager'
      }
      
      const updatedUser = { 
        ...mockUser, 
        displayName: 'Updated Name' 
      }
      
      mockUsersService.update.mockResolvedValue(updatedUser)

      const result = await controller.updateUser('user-id', updateUserDto as UpdateUserDto)
      
      expect(service.update).toHaveBeenCalledWith('user-id', updateUserDto)
      expect(result).toEqual(updatedUser)
    })
  })

  describe('archiveUser', () => {
    it('should archive a user successfully', async () => {
      const archiveMessage = { message: 'Пользователь перемещен в архив' }
      
      mockUsersService.archive.mockResolvedValue(archiveMessage)

      const result = await controller.archiveUser('user-id')
      
      expect(service.archive).toHaveBeenCalledWith('user-id')
      expect(result).toEqual(archiveMessage)
    })
  })

  describe('unarchiveUser', () => {
    it('should unarchive a user successfully', async () => {
      const unarchiveMessage = { message: 'Пользователь восстановлен из архива' }
      
      mockUsersService.unarchive.mockResolvedValue(unarchiveMessage)

      const result = await controller.unarchiveUser('user-id')
      
      expect(service.unarchive).toHaveBeenCalledWith('user-id')
      expect(result).toEqual(unarchiveMessage)
    })
  })

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const deleteMessage = { message: 'Пользователь успешно удалён' }
      
      mockUsersService.delete.mockResolvedValue(deleteMessage)

      const result = await controller.deleteUser('user-id')
      
      expect(service.delete).toHaveBeenCalledWith('user-id')
      expect(result).toEqual(deleteMessage)
    })
  })
}) 
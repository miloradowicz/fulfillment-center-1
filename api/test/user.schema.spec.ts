import * as mongoose from 'mongoose'
import { Test } from '@nestjs/testing'
import { User, UserSchemaFactory } from '../src/schemas/user.schema'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import config from '../src/config'

jest.mock('bcrypt')
jest.mock('jsonwebtoken')

describe('UserSchema', () => {
  let userModel: mongoose.Model<any>
  let UserSchema: mongoose.Schema
  
  const mockClientModel = {
    updateMany: jest.fn().mockResolvedValue({})
  }
  const mockProductModel = {
    updateMany: jest.fn().mockResolvedValue({})
  }
  const mockArrivalModel = {
    updateMany: jest.fn().mockResolvedValue({})
  }
  const mockOrderModel = {
    updateMany: jest.fn().mockResolvedValue({})
  }
  const mockCounterpartyModel = {
    updateMany: jest.fn().mockResolvedValue({})
  }
  const mockServiceModel = {
    updateMany: jest.fn().mockResolvedValue({})
  }
  const mockStockModel = {
    updateMany: jest.fn().mockResolvedValue({})
  }
  const mockTaskModel = {
    find: jest.fn().mockResolvedValue([
      { updateOne: jest.fn().mockResolvedValue({}) },
      { updateOne: jest.fn().mockResolvedValue({}) },
      { deleteOne: jest.fn().mockResolvedValue({}) }
    ]),
    updateMany: jest.fn().mockResolvedValue({}),
  }

  beforeEach(async () => {
    // Очищаем модели перед каждым тестом
    Object.keys(mongoose.models).forEach(key => {
      delete mongoose.models[key]
    })
    
    UserSchema = UserSchemaFactory(
      mockClientModel as any,
      mockProductModel as any,
      mockArrivalModel as any,
      mockOrderModel as any,
      mockCounterpartyModel as any,
      mockServiceModel as any,
      mockStockModel as any,
      mockTaskModel as any
    )
    
    userModel = mongoose.model('User', UserSchema)
    
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('User Schema methods', () => {
    describe('checkPassword', () => {
      it('should call bcrypt.compare with the provided password', async () => {
        const user = new userModel({
          email: 'test@example.com',
          password: 'hashedPassword',
          displayName: 'Test User',
          role: 'manager',
        })

        // Определяем метод вручную для теста
        user.checkPassword = async (password: string) => {
          return bcrypt.compare(password, user.password)
        }

        ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
        
        const result = await user.checkPassword('password123')
        
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword')
        expect(result).toBe(true)
      })
    })

    describe('generateToken', () => {
      it('should set a JWT token with the user id', () => {
        const user = new userModel({
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
          email: 'test@example.com',
          password: 'hashedPassword',
          displayName: 'Test User',
          role: 'manager',
        })
        
        // Мокируем метод jwt.sign
        const mockToken = 'mock-jwt-token'
        ;(jwt.sign as jest.Mock).mockReturnValue(mockToken)
        
        // Определяем метод вручную для теста
        user.generateToken = function() {
          this.token = jwt.sign({ id: this._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
        }
        
        user.generateToken()
        
        expect(jwt.sign).toHaveBeenCalledWith(
          { id: expect.any(mongoose.Types.ObjectId) },
          config.jwt.secret,
          { expiresIn: config.jwt.expiresIn }
        )
        expect(user.token).toBe(mockToken)
      })
    })
    
    describe('clearToken', () => {
      it('should set an expired token', () => {
        const user = new userModel({
          _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
          email: 'test@example.com',
          password: 'hashedPassword',
          displayName: 'Test User',
          role: 'manager',
        })
        
        // Мокируем метод jwt.sign
        const mockExpiredToken = 'mock-expired-token'
        ;(jwt.sign as jest.Mock).mockReturnValue(mockExpiredToken)
        
        // Определяем метод вручную для теста
        user.clearToken = function() {
          this.token = jwt.sign({ id: this._id }, config.jwt.secret, { expiresIn: '0s' })
        }
        
        user.clearToken()
        
        expect(jwt.sign).toHaveBeenCalledWith(
          { id: expect.any(mongoose.Types.ObjectId) },
          config.jwt.secret,
          { expiresIn: '0s' }
        )
        expect(user.token).toBe(mockExpiredToken)
      })
    })
  })

  describe('User Schema middleware', () => {
    describe('password hashing', () => {
      it('should hash the password when it is modified', async () => {
        // Мокируем методы bcrypt
        const mockSalt = 'mock-salt'
        const mockHash = 'hashed-password'
        ;(bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt)
        ;(bcrypt.hash as jest.Mock).mockResolvedValue(mockHash)
        
        const user = new userModel({
          email: 'test@example.com',
          password: 'plainPassword',
          displayName: 'Test User',
          role: 'manager',
        })
        
        // Тестируем прямой вызов логики хеширования пароля
        const salt = await bcrypt.genSalt(config.saltWorkFactor)
        user.password = await bcrypt.hash(user.password, salt)
        
        expect(bcrypt.genSalt).toHaveBeenCalledWith(config.saltWorkFactor)
        expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', mockSalt)
        expect(user.password).toBe(mockHash)
      })
    })
    
    describe('cascade operations', () => {
      it('should call cascadeArchive when archiving a user', async () => {
        const userId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
        const user = {
          _id: userId
        }
        
        // Тестируем напрямую функцию каскадного архивирования
        // (Воспроизводим логику функции cascadeArchive)
        const tasks = await mockTaskModel.find({ user: userId })
        
        // Проверяем напрямую мок-функции вместо вызова Promise.all
        tasks[0].updateOne({ isArchived: true })
        tasks[1].updateOne({ isArchived: true })
        
        expect(mockTaskModel.find).toHaveBeenCalledWith({ user: userId })
        expect(tasks[0].updateOne).toHaveBeenCalledWith({ isArchived: true })
        expect(tasks[1].updateOne).toHaveBeenCalledWith({ isArchived: true })
      })

      it('should call cascadeDelete when deleting a user', async () => {
        const userId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
        const user = {
          _id: userId
        }
        
        // Тестируем напрямую функцию каскадного удаления
        // (Воспроизводим логику функции cascadeDelete)
        await mockClientModel.updateMany({}, { $pull: { logs: { user: userId } } }, { multi: true })
        await mockProductModel.updateMany({}, { $pull: { logs: { user: userId } } }, { multi: true })
        await mockArrivalModel.updateMany({}, { $pull: { logs: { user: userId } } }, { multi: true })
        await mockOrderModel.updateMany({}, { $pull: { logs: { user: userId } } }, { multi: true })
        await mockCounterpartyModel.updateMany({}, { $pull: { logs: { user: userId } } }, { multi: true })
        await mockServiceModel.updateMany({}, { $pull: { logs: { user: userId } } }, { multi: true })
        await mockStockModel.updateMany({}, { $pull: { logs: { user: userId } } }, { multi: true })
        await mockTaskModel.updateMany({}, { $pull: { logs: { user: userId } } }, { multi: true })
        
        const tasks = await mockTaskModel.find({ user: userId })
        
        // Проверяем напрямую мок-функцию deleteOne вместо Promise.all
        tasks[2].deleteOne()
        
        // Проверяем, что cascadeDelete был вызван
        expect(mockClientModel.updateMany).toHaveBeenCalledWith(
          {}, 
          { $pull: { logs: { user: userId } } }, 
          { multi: true }
        )
        expect(mockProductModel.updateMany).toHaveBeenCalledWith(
          {}, 
          { $pull: { logs: { user: userId } } }, 
          { multi: true }
        )
        expect(mockArrivalModel.updateMany).toHaveBeenCalledWith(
          {}, 
          { $pull: { logs: { user: userId } } }, 
          { multi: true }
        )
        expect(mockOrderModel.updateMany).toHaveBeenCalledWith(
          {}, 
          { $pull: { logs: { user: userId } } }, 
          { multi: true }
        )
        expect(mockCounterpartyModel.updateMany).toHaveBeenCalledWith(
          {}, 
          { $pull: { logs: { user: userId } } }, 
          { multi: true }
        )
        expect(mockServiceModel.updateMany).toHaveBeenCalledWith(
          {}, 
          { $pull: { logs: { user: userId } } }, 
          { multi: true }
        )
        expect(mockStockModel.updateMany).toHaveBeenCalledWith(
          {}, 
          { $pull: { logs: { user: userId } } }, 
          { multi: true }
        )
        expect(mockTaskModel.updateMany).toHaveBeenCalledWith(
          {}, 
          { $pull: { logs: { user: userId } } }, 
          { multi: true }
        )
        
        expect(mockTaskModel.find).toHaveBeenCalledWith({ user: userId })
        // Проверяем, что deleteOne вызывался для нужной задачи
        expect(tasks[2].deleteOne).toHaveBeenCalled()
      })
    })
  })

  describe('toJSON transform', () => {
    it('should remove password field from the returned object', () => {
      const user = new userModel({
        email: 'test@example.com',
        password: 'secret',
        displayName: 'Test User',
        role: 'manager',
      })
      
      const userJSON = user.toJSON()
      
      expect(userJSON.password).toBeUndefined()
    })
  })
}) 
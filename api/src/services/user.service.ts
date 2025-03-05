import { User, UserDocument } from '../schemas/user.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { LoginDto } from '../dto/auth-user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(userDto: CreateUserDto){
    const existingUser = await this.userModel.findOne({ email: userDto.email })
    if (existingUser) {
      throw new HttpException(`Пользователь с эл. почтой ${ userDto.email } уже зарегистрирован`, HttpStatus.CONFLICT)
    }
    const user = new this.userModel(userDto)
    user.generateToken()
    return user.save()
  }

  async login(loginDto: LoginDto){
    const user = await this.userModel.findOne({ email: loginDto.email }).exec()
    if (!user) {
      throw new UnauthorizedException('Неверный email')
    }
    const isMatch = await user.checkPassword(loginDto.password)

    if (!isMatch) {
      throw new UnauthorizedException('Неверный пароль')
    }

    user.generateToken()
    await user.save()

    return user
  }

  async getAll() {
    return this.userModel.find()
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }
    return user
  }

  async update(id: string, userDto: UpdateUserDto) {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }
    Object.assign(user, userDto)
    user.generateToken()
    await user.save()
    return user
  }

  async delete(id: string) {
    const user = await this.userModel.findByIdAndDelete(id)
    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }
    return { message: 'Пользователь успешно удалён' }
  }
}

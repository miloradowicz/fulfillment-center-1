import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UsersService } from '../services/user.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto){
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new Error('Passwords do not match')
    }
    return await this.usersService.create(createUserDto)
  }
}

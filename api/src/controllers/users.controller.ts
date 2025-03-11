import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UsersService } from '../services/user.service'
import { UpdateUserDto } from '../dto/update-user.dto'
import { LoginDto } from '../dto/auth-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto){
    return await this.usersService.create(createUserDto)
  }

  @Post('sessions')
  async login(@Body() loginDto: LoginDto){
    return await this.usersService.login(loginDto)
  }

  @Get()
  async getUsers() {
    return this.usersService.getAll()
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getById(id)
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id)
  }
}

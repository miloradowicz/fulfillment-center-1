import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UsersService } from '../services/user.service'
import { UpdateUserDto } from '../dto/update-user.dto'
import { LoginDto } from '../dto/auth-user.dto'
import { User } from 'src/decorators/user.param-decorator'
import { HydratedUser } from 'src/types'
import { Roles } from 'src/decorators/roles.decorator'
import { RolesGuard } from 'src/guards/roles.guard'

@UseGuards(RolesGuard)
@Roles('stock-worker', 'manager', 'admin', 'super-admin')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('super-admin', 'admin')
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }

  @Roles()
  @Post('sessions')
  async login(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto)
  }

  @Delete('sessions')
  async logout(@User() user: HydratedUser) {
    return await this.usersService.logout(String(user._id))
  }

  @Get()
  async getUsers() {
    return this.usersService.getAll()
  }

  @Roles('super-admin', 'admin')
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getById(id)
  }

  @Roles('super-admin')
  @Get('archived/all')
  async getArchivedUsers() {
    return this.usersService.getArchivedUsers()
  }

  @Roles('super-admin')
  @Get('archived/:id')
  async getArchivedUserById(@Param('id') id: string) {
    return this.usersService.getArchivedById(id)
  }

  @Roles('super-admin', 'admin')
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/archive')
  async archiveUser(@Param('id') id: string) {
    return this.usersService.archive(id)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id)
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Res, UnauthorizedException, UseGuards } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UsersService } from '../services/user.service'
import { UpdateUserDto } from '../dto/update-user.dto'
import { LoginDto } from '../dto/auth-user.dto'
import { User } from 'src/decorators/user.param-decorator'
import { HydratedUser } from 'src/types'
import { Roles } from 'src/decorators/roles.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { Response } from 'express'
import { Public } from 'src/decorators/public.decorator'

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

  @Public()
  @Roles()
  @Post('sessions')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersService.login(loginDto)

    res.cookie('token', user.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    const { token, password, ...userData } = user.toObject()
    return userData
  }

  @Delete('sessions')
  async logout(@User() user: HydratedUser, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('token')
    return await this.usersService.logout(String(user._id))
  }

  @Get('me')
  getCurrentUser(@User() user: HydratedUser) {
    if (user) {
      const { token, password, ...userData } = user.toObject()
      return userData
    } else {
      throw new UnauthorizedException('Вход не выполнен.')
    }
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

  @Roles('super-admin', 'admin')
  @Get('archived/all')
  async getArchivedUsers() {
    return this.usersService.getArchivedUsers()
  }

  @Roles('super-admin', 'admin')
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

  @Roles('super-admin', 'admin')
  @Patch(':id/unarchive')
  async unarchiveUser(@Param('id') id: string) {
    return this.usersService.unarchive(id)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id)
  }
}

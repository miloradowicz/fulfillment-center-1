import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { CreateTaskDto } from '../dto/create-task.dto'
import { UpdateTaskDto } from '../dto/update-task.dto'
import { TasksService } from '../services/tasks.service'
import { Roles } from 'src/decorators/roles.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { UpdateTaskStatusDto } from 'src/dto/update-taskstatus.dto'
import { RequestWithUser } from '../types'

@UseGuards(RolesGuard)
@Roles('stock-worker', 'manager', 'admin', 'super-admin')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(@Query('user') userId: string, @Query('populate') populate?: string) {
    if (userId) {
      return await this.tasksService.getAllByUser(userId, populate === '1')
    } else {
      return await this.tasksService.getAll(populate === '1')
    }
  }

  @Roles('super-admin')
  @Get('archived/all')
  async getAllArchivedTasks(@Query('populate') populate?: string) {
    return await this.tasksService.getAllArchived(populate === '1')
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.tasksService.getById(id)
  }

  @Roles('super-admin')
  @Get('archived/:id')
  async getArchivedTaskById(@Param('id') id: string) {
    return await this.tasksService.getArchivedById(id)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Post()
  async createTask(@Body() taskDto: CreateTaskDto, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.tasksService.create(taskDto, userId)
  }

  @Roles('super-admin', 'admin', 'manager')
  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() taskDto: UpdateTaskDto, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.tasksService.update(id, taskDto, userId)
  }

  @Roles('super-admin', 'admin', 'manager', 'stock-worker')
  @Patch(':id/status')
  async updateTaskStatus(@Param('id') id: string, @Body() taskDto: UpdateTaskStatusDto, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.tasksService.updateStatus(id, taskDto, userId)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/archive')
  async archiveTask(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.tasksService.archive(id, userId)
  }

  @Roles('super-admin', 'admin')
  @Patch(':id/unarchive')
  async unarchiveTask(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user._id
    return this.tasksService.unarchive(id, userId)
  }

  @Roles('super-admin')
  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.delete(id)
  }
}

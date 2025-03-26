import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { CreateTaskDto } from '../dto/create-task.dto'
import { UpdateTaskDto } from '../dto/update-task.dto'
import { TasksService } from '../services/tasks.service'

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

  @Get('archived/all')
  async getAllArchivedTasks(@Query('populate') populate?: string) {
    return await this.tasksService.getAllArchived(populate === '1')
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.tasksService.getById(id)
  }

  @Get('archived/:id')
  async getArchivedTaskById(@Param('id') id: string) {
    return await this.tasksService.getArchivedById(id)
  }

  @Post()
  async createTask(@Body() taskDto: CreateTaskDto) {
    return this.tasksService.create(taskDto)
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() taskDto: UpdateTaskDto) {
    return this.tasksService.update(id, taskDto)
  }

  @Patch(':id/archive')
  async archiveTask(@Param('id') id: string) {
    return this.tasksService.archive(id)
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.delete(id)
  }
}

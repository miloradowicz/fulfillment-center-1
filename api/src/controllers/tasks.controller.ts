import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CreateTaskDto } from '../dto/create-task.dto'
import { UpdateTaskDto } from '../dto/update-task.dto'
import { TasksService } from '../services/tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(@Query('user') user?: string) {
    if (user === 'populate') {
      return this.tasksService.getAllWithUser()
    }
    return this.tasksService.getAll()
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.tasksService.getById(id)
  }

  @Post()
  async createTask(@Body() taskDto: CreateTaskDto) {
    return this.tasksService.create(taskDto)
  }

  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() taskDto: UpdateTaskDto) {
    return this.tasksService.update(id, taskDto)
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.delete(id)
  }
}

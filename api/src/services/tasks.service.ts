import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Task, TaskDocument } from '../schemas/task.schema'
import { CreateTaskDto } from '../dto/create-task.dto'
import { UpdateTaskDto } from '../dto/update-task.dto'

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) {}

  async getAllByUser(userId: string, populate: boolean) {
    const unarchived = this.taskModel.find({ isArchived: false })

    if (populate) {
      return (await unarchived.find({ user: userId }).populate('user', 'email displayName role')).reverse()
    }

    return (await unarchived.find({ user: userId })).reverse()
  }

  async getAll(populate: boolean) {
    const unarchived = this.taskModel.find({ isArchived: false })

    if (populate) {
      return (await unarchived.find().populate('user', 'email displayName role')).reverse()
    }

    return (await unarchived.find()).reverse()
  }

  async getById(id: string) {
    const task = await this.taskModel.findById(id).populate('user', 'email displayName role').exec()

    if (!task) throw new NotFoundException('Задача не найдена')

    if (task.isArchived) throw new ForbiddenException('Задача в архиве')

    return task
  }

  async create(taskDto: CreateTaskDto) {
    return await this.taskModel.create(taskDto)
  }

  async update(id: string, taskDto: UpdateTaskDto) {
    const task = await this.taskModel.findByIdAndUpdate(id, taskDto, { new: true })
    if (!task) {
      throw new NotFoundException('Задача не найдена')
    }
    return task
  }

  async archive(id: string) {
    const task = await this.taskModel.findByIdAndUpdate(id, { isArchived: true })

    if (!task) throw new NotFoundException('Задача не найдена')

    if (task.isArchived) throw new ForbiddenException('Задача уже в архиве')

    return { message: 'Задача перемещена в архив' }
  }

  async delete(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id)
    if (!task) throw new NotFoundException('Задача не найдена')
    return { message: 'Задача успешно удалёна' }
  }
}

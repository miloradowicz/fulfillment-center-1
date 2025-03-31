import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Task, TaskDocument } from '../schemas/task.schema'
import { DailyTaskCount, UserTaskReport } from '../types'

@Injectable()
export class ReportService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) {}

  async getReportForPeriod(
    tab: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ userTaskReports: UserTaskReport[]; dailyTaskCounts: DailyTaskCount[] }> {
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    switch (tab) {
    case 'tasks':
      return this.getTaskReport(startDate, endDate)
    default:
      throw new Error('Invalid tab value')
    }
  }

  private async getTaskReport(
    startDate: Date,
    endDate: Date
  ): Promise<{ userTaskReports: UserTaskReport[]; dailyTaskCounts: DailyTaskCount[] }> {
    const tasks = await this.taskModel
      .find({
        date_Done: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      })
      .populate('user', 'displayName')

    const userTaskCount = tasks.reduce((acc, task) => {
      const userId = task.user.toString()  // Преобразуем ObjectId в строку

      if (!acc[userId]) {
        acc[userId] = { user: task.user, taskCount: 0 }
      }
      acc[userId].taskCount += 1

      return acc
    }, {} as Record<string, UserTaskReport>)

    const userTaskReports = Object.values(userTaskCount)

    const dailyTaskCounts: DailyTaskCount[] = []

    tasks.forEach(task => {
      const taskDate = task.date_Done ? new Date(task.date_Done).toISOString().split('T')[0] : '' // Форматируем дату

      const existingDay = dailyTaskCounts.find(day => day.date === taskDate)

      if (existingDay) {
        existingDay.taskCount += 1
      } else {
        dailyTaskCounts.push({
          date: taskDate,
          taskCount: 1,
        })
      }
    })

    return { userTaskReports, dailyTaskCounts }
  }
}

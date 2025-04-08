import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Task, TaskDocument } from '../schemas/task.schema'
import { clientOrderReport, DailyTaskCount, OrderWithClient, UserTaskReport } from '../types'
import { Order, OrderDocument } from '../schemas/order.schema'
import { normalizeDates } from '../utils/normalazeDates'

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,) {}

  async getReportTaskForPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<{ userTaskReports: UserTaskReport[]; dailyTaskCounts: DailyTaskCount[] }> {
    const [normalizedStart, normalizedEnd] = normalizeDates(startDate, endDate)
    return this.getTaskReport(normalizedStart, normalizedEnd)
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
      const userId = task.user.toString()

      if (!acc[userId]) {
        acc[userId] = { user: task.user, taskCount: 0, tasks: [] }
      }
      acc[userId].taskCount += 1
      acc[userId].tasks.push({ _id: String(task._id), taskNumber: task.taskNumber })

      return acc
    }, {} as Record<string, UserTaskReport>)

    const userTaskReports = Object.values(userTaskCount)

    const dailyTaskCounts: DailyTaskCount[] = []

    tasks.forEach(task => {
      const taskDate = task.date_Done ? new Date(task.date_Done).toISOString().split('T')[0] : ''
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

  async getReportClientForPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<{ clientOrderReport: clientOrderReport[] }> {
    const [normalizedStart, normalizedEnd] = normalizeDates(startDate, endDate)
    return this.getClientReport(normalizedStart, normalizedEnd)
  }

  private async getClientReport(
    startDate: Date,
    endDate: Date
  ): Promise<{ clientOrderReport: clientOrderReport[] }> {
    const orders = await this.orderModel
      .find({
        createdAt: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      })
      .populate('client', 'name') as unknown as OrderWithClient[]
    console.log(orders)

    const clientOrderCount = orders.reduce((acc, order): Record<string, clientOrderReport> => {
      const clientId = String(order.client._id)

      if (!acc[clientId]) {
        acc[clientId] = { client: { _id: order.client._id.toString(), name:order.client.name }, orderCount: 0, orders: [] }
      }
      acc[clientId].orderCount += 1
      acc[clientId].orders.push({ _id: String(order._id),  orderNumber: order.orderNumber ?? '', status:order.status })
      return acc

    }, {} as Record<string, clientOrderReport>)

    const clientOrderReport = Object.values(clientOrderCount)

    return { clientOrderReport }
  }
}



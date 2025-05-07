import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Task, TaskDocument } from '../schemas/task.schema'
import {
  ArrivalWithClient,
  clientFullReport,
  clientOrderReport,
  DailyTaskCount, InvoiceWithClient,
  OrderWithClient,
  TaskInterface,
  UserTaskReport,
} from '../types'
import { Order, OrderDocument } from '../schemas/order.schema'
import { normalizeDates } from '../utils/normalazeDates'
import { Client, ClientDocument } from '../schemas/client.schema'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema'

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>) {
  }

  async getReportTaskForPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<{ userTaskReports: UserTaskReport[]; dailyTaskCounts: DailyTaskCount[] }> {
    const [normalizedStart, normalizedEnd] = normalizeDates(startDate, endDate)
    return this.getTaskReport(normalizedStart, normalizedEnd)
  }

  async getTaskReport(
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
      .populate('user', 'displayName isArchived') as unknown as TaskInterface[]

    const userTaskCount = tasks.reduce((acc, task) => {
      const userId = task.user._id.toString()

      if (!acc[userId]) {
        acc[userId] = {
          user: {
            _id: task.user._id.toString(),
            displayName: task.user.displayName,
            isArchived: task.user.isArchived,
          }, taskCount: 0, tasks: [],
        }
      }
      acc[userId].taskCount += 1
      acc[userId].tasks.push({ _id: String(task._id), taskNumber: task.taskNumber, isArchived: task.isArchived })

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
  ): Promise<{  clientReport: clientFullReport[]  }> {
    const [normalizedStart, normalizedEnd] = normalizeDates(startDate, endDate)
    return this.getClientReport(normalizedStart, normalizedEnd)
  }

  async getClientReport(
    startDate: Date,
    endDate: Date
  ): Promise<{ clientReport: clientFullReport[] }> {
    const [orders, arrivals, invoices] = await Promise.all([
      this.orderModel
        .find({
          createdAt: {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString(),
          },
        })
        .populate('client', 'name isArchived') as unknown as OrderWithClient[],

      this.arrivalModel
        .find({
          createdAt: {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString(),
          },
        })
        .populate('client', 'name isArchived') as unknown as ArrivalWithClient[],

      this.invoiceModel
        .find({
          createdAt: {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString(),
          },
        })
        .populate('client', 'name isArchived') as unknown as InvoiceWithClient[],
    ])

    const clientReportMap = new Map<string, clientFullReport>()

    const upsertClient = (client: { _id: any; name: string; isArchived: boolean }) => {
      const id = String(client._id)
      if (!clientReportMap.has(id)) {
        clientReportMap.set(id, {
          client: { _id: id, name: client.name, isArchived: client.isArchived },
          orders: [],
          arrivals: [],
          invoices: [],
        })
      }
      return clientReportMap.get(id)!
    }

    for (const order of orders) {
      const clientEntry = upsertClient(order.client)
      clientEntry.orders.push({
        _id: String(order._id),
        orderNumber: order.orderNumber ?? '',
        status: order.status,
        isArchived: order.isArchived,
      })
    }

    for (const arrival of arrivals) {
      const clientEntry = upsertClient(arrival.client)
      clientEntry.arrivals.push({
        _id: String(arrival._id),
        arrivalNumber: arrival.arrivalNumber,
        arrival_status: arrival.arrival_status,
        isArchived: arrival.isArchived,
      })
    }

    for (const invoice of invoices) {
      const clientEntry = upsertClient(invoice.client)
      clientEntry.invoices.push({
        _id: String(invoice._id),
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        totalAmount: invoice.totalAmount,
        isArchived: invoice.isArchived,
        paidAmount: invoice.paid_amount,
      })
    }

    const clients = await this.clientModel.find()
    for (const client of clients) {
      upsertClient(client) // обеспечиваем всех клиентов даже без данных
    }

    const clientReport = Array.from(clientReportMap.values()).sort(
      (a, b) => b.orders.length - a.orders.length
    )

    return { clientReport }
  }

}


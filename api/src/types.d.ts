import { Request } from 'express'
import { User } from './schemas/user.schema'
import { HydratedDocument } from 'mongoose'

export type HydratedUser = HydratedDocument<User>

export type RequestWithUser = Request & { user: HydratedUser }

export type JwtToken = { id: string }

export interface UserTaskReport {
  user: string
  taskCount: number
  tasks: {
    _id: string
    taskNumber: string
  }[]
}

interface DailyTaskCount {
  date: string;
  taskCount: number;
}

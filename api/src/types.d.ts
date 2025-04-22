import { Request } from 'express'
import { User } from './schemas/user.schema'
import { HydratedDocument, Types } from 'mongoose'

export type HydratedUser = HydratedDocument<User>

export type RequestWithUser = Request & { user: HydratedUser }

export type JwtToken = { id: string }

export interface UserTaskReport {
  user: {
    _id: string
    displayName: string
    isArchived: boolean
  }
  taskCount: number
  tasks: {
    _id: string
    taskNumber: string
    isArchived:boolean
  }[]
}


export interface TaskInterface {
  _id: Types.ObjectId
  isArchived: boolean
  taskNumber: string
  user: {
    _id: Types.ObjectId
    displayName: string
    isArchived: boolean
  }
  title: string
  date_ToDO: Date | null
  date_inProgress: Date | null
  date_Done: Date | null
  status: string
  type: string
  createdAt: Date
  updatedAt: Date
  logs: Log[]
  __v: number
}

interface DailyTaskCount {
  date: string;
  taskCount: number;
}

export interface clientOrderReport {
  client: {_id:string,name:string,isArchived:boolean},
  orderCount: number
  orders: {
    _id: string
    orderNumber: string
    status:string
    isArchived:boolean
  }[]
}

export interface Order {
  _id: string
  isArchived: boolean
  client: string
  products: ProductOrder[]
  price: number
  stock: string
  sent_at: string
  delivered_at?: string
  comment?: string
  status: string
  orderNumber?: string
  logs?: Log[]
  defects: Defect[]
  documents?: { document: string }[]
}

interface PopulatedClient {
  _id: Types.ObjectId
  name: string
}

interface OrderWithClient extends Order {
  client: PopulatedClient
}

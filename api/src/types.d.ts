import { Request } from 'express'
import { User } from './schemas/user.schema'
import { HydratedDocument, Types } from 'mongoose'
import { ArrayElement, PropType } from './utils/type-helpers'
import { StockDocument } from './schemas/stock.schema'

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

export type WriteOff = ArrayElement<PropType<StockDocument, 'write_offs'>>

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

interface OrderWithClient extends Order {
  client: PopulatedClient
}

type clientFullReport = {
  client: { _id: string; name: string; isArchived: boolean }
  orders: { _id: string; orderNumber: string; status: string; isArchived: boolean }[]
  arrivals: { _id: string; arrivalNumber: string; arrival_status: string; isArchived: boolean }[]
  invoices: { _id: string; invoiceNumber: string; status: string; totalAmount: number; paidAmount:number; isArchived: boolean }[]
}

interface PopulatedClient {
  _id: Types.ObjectId
  name: string
  isArchived: boolean
}

// ArrivalWithClient
export interface Arrival {
  _id: string
  isArchived: boolean
  arrivalNumber: string
  client: string
  products: {
    product: string
    description: string
    amount: number
  }[]
  arrival_status: 'ожидается доставка' | 'получена' | 'отсортирована'
  arrival_date: string
  sent_amount?: string
  pickup_location?: string
  documents?: { document: string }[]
  shipping_agent?: string | null
  stock: string
  logs: {
    user: string
    change: string
    date: string
  }[]
  defects: {
    product: string
    defect_description: string
    amount: number
  }[]
  received_amount: {
    product: string
    description: string
    amount: number
  }[]
  services: {
    service: string
    service_amount: number
    service_price?: number
  }[]
  comment?: string
}

export interface ArrivalWithClient extends Arrival {
  client: PopulatedClient
}

// InvoiceWithClient
export interface Invoice {
  _id: string
  isArchived: boolean
  invoiceNumber: string
  client: string
  services: {
    service: string
    service_amount: number
    service_price?: number
    service_type: 'внутренняя' | 'внешняя'
  }[]
  totalAmount: number
  paid_amount: number
  discount?: number
  status: 'в ожидании' | 'оплачено' | 'частично оплачено'
  associatedArrival?: string
  associatedOrder?: string
  associatedArrivalServices: {
    service: string
    service_amount: number
    service_price?: number
    service_type: 'внутренняя' | 'внешняя'
  }[]
  associatedOrderServices: {
    service: string
    service_amount: number
    service_price?: number
    service_type: 'внутренняя' | 'внешняя'
  }[]
  logs: {
    user: string
    change: string
    date: string
  }[]
}

export interface InvoiceWithClient extends Invoice {
  client: PopulatedClient
}

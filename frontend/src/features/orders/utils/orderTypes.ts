import {
  Defect, OrderWithClient, OrderWithProductsAndClients,
  ProductOrder,
  ServiceOrder,
} from '@/types'
import { ItemType } from '@/constants.ts'

export interface ErrorsFields {
  client: string
  product: string
  price: string
  stock: string
  amount: string
  defect_description: string
  sent_at: string
  delivered_at: string
  comment?: string
  status?: string
  service?: string
  service_amount?: string
  service_price?: string
}

export type OrderData = OrderWithClient | OrderWithProductsAndClients

export type ErrorMessages = Pick<
  ErrorsFields,
  'client'
  | 'product'
  | 'price'
  | 'stock'
  | 'amount'
  | 'defect_description'
  | 'sent_at'
  | 'status'
  | 'service'
  | 'service_amount'
  | 'service_price'
>

export type ItemInitialStateMap = {
  [ItemType.PRODUCTS]: ProductOrder,
  [ItemType.DEFECTS]: Defect,
  [ItemType.SERVICES]: ServiceOrder,
}

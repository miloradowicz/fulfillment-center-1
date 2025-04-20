import {
  Defect,
  ProductOrder,
  ServiceOrder,
} from '@/types'

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

export type ErrorMessages = Pick<
  ErrorsFields,
  'client'
  | 'product'
  | 'price'
  | 'stock'
  | 'amount'
  | 'defect_description'
  | 'sent_at'
  | 'delivered_at'
  | 'status'
  | 'service'
  | 'service_amount'
  | 'service_price'
>

export type ProductField = { product: string | { _id: string } }
export type ServiceField = { service: string | { _id: string } }

export enum ItemType {
  PRODUCTS = 'products',
  DEFECTS = 'defects',
  SERVICES = 'services',
}

export type ItemInitialStateMap = {
  [ItemType.PRODUCTS]: ProductOrder,
  [ItemType.DEFECTS]: Defect,
  [ItemType.SERVICES]: ServiceOrder,
}

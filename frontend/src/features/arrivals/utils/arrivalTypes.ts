import {
  ArrivalWithClient,
  ArrivalWithPopulate,
  Defect,
  ErrorsFields,
  ProductArrival,
  ServiceArrival,
} from '@/types'
import { ItemType } from '@/constants.ts'

export type ArrivalData = ArrivalWithClient | ArrivalWithPopulate

export type ErrorMessages = Pick<
  ErrorsFields,
  'client'
  | 'product'
  | 'arrival_date'
  | 'amount'
  | 'stock'
  | 'defect_description'
  | 'arrival_status'
  | 'arrival_price'
  | 'service'
  | 'service_amount'
  | 'service_price'
>

export type ProductField = { product: string | { _id: string } }
export type ServiceField = { service: string | { _id: string } }

export type ItemInitialStateMap = {
  [ItemType.PRODUCTS]: ProductArrival,
  [ItemType.RECEIVED_AMOUNT]: ProductArrival,
  [ItemType.DEFECTS]: Defect,
  [ItemType.SERVICES]: ServiceArrival,
}

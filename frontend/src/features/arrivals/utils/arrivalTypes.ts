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
  | 'service'
  | 'service_amount'
  | 'service_price'
>

export type ItemInitialStateMap = {
  [ItemType.PRODUCTS]: ProductArrival,
  [ItemType.RECEIVED_AMOUNT]: ProductArrival,
  [ItemType.DEFECTS]: Defect,
  [ItemType.SERVICES]: ServiceArrival,
}

import { StockWriteOffWithPopulate, WriteOff } from '@/types'
import { ItemType } from '@/constants.ts'

export interface ErrorsFields {
  stock: string
  client: string
  product: string
  amount: string
  reason: string
}

export type StockWriteOffData = StockWriteOffWithPopulate

export type ErrorMessages = Pick<
  ErrorsFields,
  'stock'
  | 'client'
  | 'product'
  | 'amount'
  | 'reason'
>

export type ItemInitialStateMap = {
  [ItemType.WRITEOFFS]: WriteOff,
}

export enum FormType {
  Edit,
  Create,
}

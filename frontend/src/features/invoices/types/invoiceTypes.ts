import {
  ErrorsFields,
  Invoice,
} from '@/types'

export type InvoiceData = Invoice

export type ErrorMessages = Pick<ErrorsFields,
  'client'
  | 'service'
  | 'service_amount'
  | 'service_price'
  | 'paid_amount'
  | 'discount'
  >

export type ServiceField = { service: string | { _id: string } }

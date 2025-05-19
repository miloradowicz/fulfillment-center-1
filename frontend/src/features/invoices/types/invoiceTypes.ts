import {
  ErrorsFields,
  Invoice, ServiceType,
} from '@/types'

export type InvoiceData = Omit<Invoice, 'associatedArrival' | 'associatedOrder'> & {
  associatedArrival?: string,
  associatedOrder?: string,
}

export type ErrorMessages = Pick<ErrorsFields,
  'client'
  | 'associatedArrival'
  | 'associatedOrder'
  | 'service'
  | 'service_amount'
  | 'service_price'
  | 'paid_amount'
  | 'discount'
  >

export type ServiceField = {
  service: string | { _id: string },
  service_type?: ServiceType
}

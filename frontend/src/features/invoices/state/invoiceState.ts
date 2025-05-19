import { ServiceType } from '@/types'

export const initialState = {
  client: '',
  services: [],
  associatedArrival: '',
  associatedOrder: '',
  paid_amount: 0,
  discount: 0,
}

export const initialServiceState = {
  service: '',
  service_amount: 1,
  service_price: 0,
  service_type: 'внутренняя' as ServiceType,
}

export const initialErrorState = {
  client: '',
  service: '',
  service_amount: '',
  service_price: '',
  associatedArrival: '',
  associatedOrder: '',
  paid_amount: '',
  discount: '',
}

export type FormType = 'arrival' | 'product'

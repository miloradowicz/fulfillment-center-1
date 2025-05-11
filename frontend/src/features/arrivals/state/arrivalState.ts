import { ServiceType } from '@/types'

export const initialState = {
  client: '',
  arrival_price: 0,
  arrival_date: '',
  sent_amount: '',
  stock: '',
  pickup_location: '',
  shipping_agent: '',
  products: [],
  defects: [],
  services: [],
  received_amount: [],
  arrival_status: '',
  documents: [],
  comment: '',
}

export const initialItemState = {
  product: '',
  description: '',
  defect_description:'',
  amount: 0,
}

export const initialServiceState = {
  service: '',
  service_amount: 1,
  service_price: 0,
  service_type: 'внутренняя' as ServiceType,
}

export const initialErrorState = {
  client: '',
  product: '',
  arrival_price: '',
  arrival_date: '',
  amount: '',
  stock: '',
  service: '',
  service_amount: '',
  defect_description: '',
  arrival_status: '',
}

export type FormType = 'arrival' | 'product' | 'invoice'

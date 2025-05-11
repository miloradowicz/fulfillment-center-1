import { OrderMutation, ServiceType } from '@/types'

export const initialState: OrderMutation = {
  client: '',
  products: [],
  price: 0,
  stock: '',
  sent_at: '',
  delivered_at: '',
  comment: '',
  defects: [],
  services: [],
  status: '',
  paymentStatus: '',
  documents: [],
}

export const initialItemState = {
  product: '',
  description: '',
  defect_description: '',
  amount: 0,
}

export const initialServiceState = {
  service: '',
  service_amount: 1,
  service_price: 0,
  service_type: 'внутренняя' as ServiceType,
}

export const initialErrorState = {
  product: '',
  amount: '',
  defect_description: '',
  client: '',
  sent_at: '',
  stock: '',
  price: '',
  service: '',
  service_amount: '',
}

export type FormType = 'order' | 'invoice'

import { OrderMutation } from '@/types'

export const initialStateOrder: OrderMutation = {
  client: '',
  products: [],
  price: 0,
  stock: '',
  sent_at: '',
  delivered_at: '',
  comment: '',
  defects: [],
  status: '',
  documents: [],
}

export const initialStateProductForOrder = {
  product: '',
  description: '',
  amount: 0,
}

export const initialStateDefectForOrder = {
  product: '',
  defect_description: '',
  amount: 0,
}

export const initialStateErrorForOrder = {
  client: '',
  product: '',
  stock: '',
  price: '',
  sent_at: '',
  amount: '',
  defect_description: '',
  status: '',
}

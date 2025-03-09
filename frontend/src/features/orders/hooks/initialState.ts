import {OrderMutation} from "../../../types";

export const initialStateOrder: OrderMutation = {
  client: '',
  products: [],
  price: 0,
  sent_at: '',
  delivered_at: '',
  comment: '',
  defects: [],
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
  price: 0,
  sent_at: '',
  amount: 0,
  defect_description: '',
  delivered_at: '',
}

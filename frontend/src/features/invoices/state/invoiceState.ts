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

export type FormType = 'arrival' | 'product'

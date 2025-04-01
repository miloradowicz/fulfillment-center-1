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
  received_amount: [],
  arrival_status: '',
  documents: [],
}

export const initialItemState = {
  product: '',
  description: '',
  amount: 0,
}

export const initialErrorState = {
  client: '',
  product: '',
  arrival_price: '',
  arrival_date: '',
  amount: '',
  stock: '',
  defect_description: '',
  arrival_status: '',
}

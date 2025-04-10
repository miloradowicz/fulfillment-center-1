export const initialState = {
  user: '',
  title: '',
  description: '',
  type: '',
  associated_order: null,
  associated_arrival: null,
}

export const initialErrorState = {
  user: '',
  title: '',
}

export interface TaskError {
  user: string,
  title: string,
}

export const taskStatus = ['к выполнению', 'в работе', 'готово']

export const taskType = ['поставка', 'заказ', 'другое']

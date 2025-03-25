export const initialState = {
  user: '',
  title: '',
  description: '',
  type: '',
  associatedOrder: '',
  associatedArrival: '',
  status: 'к выполнению',
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

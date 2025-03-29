export const initialState = {
  user: '',
  title: '',
  description: '',
  type: '',
  associated_order: null,
  associated_arrival: null,
  status: 'к выполнению',
  date_ToDO: new Date(),
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

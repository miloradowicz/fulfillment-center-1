import { ClipboardList, ListTodo, Truck } from 'lucide-react'

export const getTaskIcon = (type: string, className = '') => {
  switch (type) {
  case 'поставка':
    return <Truck className={className} />
  case 'заказ':
    return <ClipboardList className={className} />
  default:
    return <ListTodo className={className} />
  }
}

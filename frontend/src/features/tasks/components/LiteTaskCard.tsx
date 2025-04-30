import React, { memo } from 'react'
import { ClipboardList, ListTodo, Truck } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { TaskCardProps } from '../hooks/TypesProps'

const getTaskIcon = (type: string, className = '') => {
  switch (type) {
  case 'поставка':
    return <Truck className={className} />
  case 'заказ':
    return <ClipboardList className={className} />
  default:
    return <ListTodo className={className} />
  }
}

const LiteTaskCard: React.FC<TaskCardProps> = memo(({ task }) => {
  console.log('render')
  return (
    <div
      id={task._id}
      className="rounded-[12px]
        shadow-[0_4px_10px_rgba(0,0,0,0.1)]
        bg-white
        mb-2
        relative
        cursor-default
        touch-auto
        select-none"
    >
      <div className="bg-white p-4 rounded-xl">
        <div className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-2 rounded-md text-gray-700">
            {getTaskIcon(task.type, 'h-5 w-5 text-gray-700')}
            <h5>
              <strong>{task.taskNumber}</strong>
            </h5>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <p>{task.title}</p>

          {task.associated_arrival && (
            <NavLink
              to={`/arrivals/${ task.associated_arrival._id }`}
              target="_blank"
              className="text-blue-600 font-medium hover:underline underline-offset-4"
            >
              {`Поставка ${ task.associated_arrival.arrivalNumber }`}
            </NavLink>
          )}

          {task.associated_order && (
            <NavLink
              to={`/orders/${ task.associated_order._id }`}
              target="_blank"
              className="text-blue-600 font-medium hover:underline underline-offset-4"
            >
              {`Заказ ${ task.associated_order.orderNumber }`}
            </NavLink>
          )}

          <p className="text-[14px]">
            Исполнитель: <span className="font-bold">{task.user.displayName}</span>
          </p>
        </div>
      </div>
    </div>
  )
})

export default LiteTaskCard

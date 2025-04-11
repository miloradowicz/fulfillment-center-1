import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectTask } from '@/store/slices/taskSlice.ts'
import { fetchTaskById } from '@/store/thunks/tasksThunk.ts'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Clipboard, Link2 } from 'lucide-react'
import { getStatusStyles } from '@/features/tasks/utils/statusStyle.ts'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'


interface Props {
  taskId?: string
}

const TaskDetails: React.FC<Props> = ({ taskId }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const task = useAppSelector(selectTask)

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId))
      navigate(`/tasks/${ taskId }`, { replace: true })
    }
  }, [dispatch, taskId, navigate])

  if (!task) {
    return <div>Задача не найдена...</div>
  }

  return (
    <div className="p-4 max-w-3xl w-11/12 mx-auto md:text-[16px] text-[12px] text-gray-600">
      <div className="flex md:flex-nowrap flex-wrap border-1 rounded-md">
        <div className="flex-8 p-4 space-y-4 min-w-[300px]">
          <div className="flex justify-between border-b-1 sm:text-[18px] text-sm pb-2 font-bold">
            <span>{task.taskNumber}</span>
          </div>
          <div className="flex justify-between items-start">
            <h2 className="font-bold md:text-2xl sm:text-xl text-[16px] text-gray-700">{task.title}</h2>
          </div>
          <div className="max-h-100 min-h-[40vh] overflow-y-auto">
            <p>{task.description}</p>
          </div>
        </div>
        <div className="flex-2 flex flex-col items-center space-y-4 sm:px-4 p-4 border-l-1">
          <div className="flex justify-center">
            <Badge style={getStatusStyles(task.status)} className="text-sm font-medium">
              {task.status}
            </Badge>
          </div>
          <div className="flex flex-col items-center">
            <User className="mb-1" />
            <p className="font-semibold text-gray-700">Исполнитель:</p>
            <p className="w-[100%] text-center">{task.user.displayName}</p>
          </div>
          <div className="flex flex-col items-center">
            <Clipboard/>
            <p className="font-semibold text-gray-700">Тип:</p>
            <p className="w-[100%] text-center">{task.type}</p>
          </div>
          {task.associated_arrival && (
            <div className="flex flex-col items-center">
              <Link2/>
              <p className="font-semibold text-gray-700">Поставка:</p>
              <a href={`/arrivals/${ task.associated_arrival._id }`} target='_blank' className="text-[#1A73E8] underline underline-offset-4">
                {`Поставка ${ task.associated_arrival.arrivalNumber }`}
              </a>
            </div>
          )
          }
          {task.associated_order && (
            <div className="flex flex-col items-center">
              <Link2/>
              <p className="font-semibold text-gray-700">Заказ:</p>
              <a href={`/arrivals/${ task.associated_order._id }`} target='_blank' className="text-[#1A73E8] underline underline-offset-4 w-[100%] text-center">
                {`Заказ ${ task.associated_order.orderNumber }`}
              </a>
            </div>
          )
          }
          <div className="flex flex-col gap-4 mt-auto sm:text-[14px] text-[12px]">
            <div className="flex flex-col items-center">
              <Calendar/>
              <p className="font-semibold text-gray-700">Создана:</p>
              <p className="w-[100%] text-center">{dayjs(task.createdAt).format('D MMM YYYY')}</p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar />
              <p className="font-semibold text-gray-700">Обновлена:</p>
              <p className="w-[100%] text-center">{dayjs(task.updatedAt).format('D MMM YYYY')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails

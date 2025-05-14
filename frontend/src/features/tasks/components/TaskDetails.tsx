import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectTask } from '@/store/slices/taskSlice.ts'
import { fetchTaskById } from '@/store/thunks/tasksThunk.ts'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import StatusCell from '@/features/tasks/components/StatusCell.tsx'
import { getTaskIcon } from '@/features/tasks/utils/getTaskIcon.tsx'

interface Props {
  taskId?: string
  selectedUser: string | null
}

const TaskDetails: React.FC<Props> = ({ taskId, selectedUser }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const task = useAppSelector(selectTask)

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId))
    }
  }, [dispatch, taskId, navigate])

  if (!task) {
    return <div>Задача не найдена...</div>
  }

  return (
    <div className="pt-10 max-w-[350px] w-full max-h-[80vh] h-full mx-auto text-[14px] text-gray-600">
      <div className="flex flex-col justify-between shadow-[0_4px_10px_rgba(0,0,0,0.1)] rounded-md ">
        <div className="flex-8 py-4">
          <div className="flex justify-center items-center gap-2 rounded-md mb-4">
            {getTaskIcon(task.type, 'h-6 w-6 text-gray-700')}
            <h5>
              <strong>{task.taskNumber}</strong>
            </h5>
          </div>
          <div>
            <StatusCell task={task} selectedUser={selectedUser} taskId={taskId}/>
          </div>
          <div className="px-4 my-2">
            <h3 className="font-bold text-gray-800 text-[16px] text-center">{task.title}</h3>
          </div>
          <div className="px-4 overflow-y-auto max-h-[400px]">
            <p className="indent-5">{task.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-2 py-6 pl-6 border-l-1">
          <div className="flex items-center gap-x-2 w-full">
            <p className="w-1/3 font-semibold text-gray-700">Исполнитель:</p>
            <p className="w-2/3 text-gray-600">{task.user.displayName}</p>
          </div>
          {task.associated_arrival && (
            <div className="flex justify-start gap-x-2 w-full">
              <p className="w-1/3 font-semibold text-gray-700">Поставка:</p>
              <a href={`/arrivals/${ task.associated_arrival._id }`} target='_blank' className="w-2/3 text-[#1A73E8] underline underline-offset-4">
                {`${ task.associated_arrival.arrivalNumber }`}
              </a>
            </div>
          )
          }
          {task.associated_order && (
            <div className="flex justify-start gap-2 w-full">
              <p className="w-1/3 font-semibold text-gray-700">Заказ:</p>
              <a href={`/orders/${ task.associated_order._id }`} target='_blank' className="w-2/3 text-[#1A73E8] underline underline-offset-4">
                {`${ task.associated_order.orderNumber }`}
              </a>
            </div>
          )
          }
          <div className="flex flex-col w-full justify-evenly gap-2 mt-auto">
            <div className="inline-flex gap-2">
              <p className="w-1/3 font-semibold text-gray-700">Создана:</p>
              <p className="w-2/3">{dayjs(task.createdAt).format('D MMM YYYY')}</p>
            </div>
            <div className="inline-flex gap-2">
              <p className="w-1/3 font-semibold text-gray-700">Обновлена:</p>
              <p className="w-2/3">{dayjs(task.updatedAt).format('D MMM YYYY')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectTask } from '@/store/slices/taskSlice.ts'
import { fetchTaskById } from '@/store/thunks/tasksThunk.ts'
import { Badge } from '@/components/ui/badge'
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

  console.log(task)

  if (!task) {
    return <div>Задача не найдена...</div>
  }

  return (
    <div className="p-4 max-w-3xl w-11/12 mx-auto">
      <div className="flex">
        <div className="flex-7 p-4 space-y-4">
          <div className="flex justify-between">
            <span>{task.taskNumber}</span>
          </div>
          <div className="flex justify-between items-start">
            <h2 className="font-semibold">{task.title}</h2>
          </div>
          <div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Тип:</span>
                <span>{task.type}</span>
              </div>
              {task.date_Done && (
                <div className="flex justify-between">
                  <span className="font-medium">Дата завершения:</span>
                  <span>{new Date(task.date_Done).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-3 space-y-4 px-4 py-2 border-1 rounded-md">
          <div className="flex border-b-1 pb-2 justify-center">
            <Badge style={getStatusStyles(task.status)} className="text-sm">
              {task.status}
            </Badge>
          </div>
          <div>
            <p className="font-semibold">Исполнитель</p>
            <p>{task.user.displayName}</p>
          </div>
          <div>
            <p className="font-semibold">Дата</p>
            <p>{dayjs(task.createdAt).format('D MMMM YYYY HH:mm')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails

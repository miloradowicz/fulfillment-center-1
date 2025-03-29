import { Dispatch, SetStateAction } from 'react'
import { TaskWithPopulate } from '../../../types'
import { AppDispatch } from '../../../app/store'
import { updateTask } from '../../../store/thunks/tasksThunk.ts'
import { DragEndEvent } from '@dnd-kit/core'
import dayjs from 'dayjs'

interface DragEndProps {
  e: DragEndEvent;
  todoItems: TaskWithPopulate[];
  setTodoItems: Dispatch<SetStateAction<TaskWithPopulate[]>>;
  doneItems: TaskWithPopulate[];
  setDoneItems: Dispatch<SetStateAction<TaskWithPopulate[]>>;
  inProgressItems: TaskWithPopulate[];
  setInProgressItems: Dispatch<SetStateAction<TaskWithPopulate[]>>;
  dispatch: AppDispatch;
}

export const onDragEnd = async ({
  e,
  todoItems,
  setTodoItems,
  doneItems,
  setDoneItems,
  inProgressItems,
  setInProgressItems,
  dispatch,
}: DragEndProps) => {
  if (!e.over) return
  if (e.active.id === e.over.id) return
  const container = e.over?.id
  const taskData = e.active?.data?.current
  if (!taskData) return

  const { _id, title, description,date_inProgress, date_Done,date_ToDO,  type,associated_order,  associated_arrival,  createdAt, user, parent } = taskData
  const userID = user?._id ?? ''
  const userEmail = user?.email ?? ''
  const userName = user?.displayName ?? ''
  const userRole = user?.role ?? 'stock-worker'

  const removeTask = (items: TaskWithPopulate[]) => items.filter(item => item._id !== _id)

  if (parent === 'к выполнению') {
    setTodoItems(removeTask(todoItems))
  } else if (parent === 'готово') {
    setDoneItems(removeTask(doneItems))
  } else if (parent === 'в работе') {
    setInProgressItems(removeTask(inProgressItems))
  }


  const currentTime = dayjs().toDate()

  const newItem: TaskWithPopulate = {
    createdAt,
    updatedAt: currentTime,
    _id,
    title,
    description,
    type,
    associated_order,
    associated_arrival,
    date_inProgress,
    date_Done,
    date_ToDO,
    user: {
      _id: userID,
      email: userEmail,
      displayName: userName,
      role: userRole,
    },
    status: container as string,
  }

  if (container === 'к выполнению') {
    setTodoItems(prev => [...prev, newItem])
  } else if (container === 'готово') {
    setDoneItems(prev => [...prev, newItem])
  } else if (container === 'в работе') {
    setInProgressItems(prev => [...prev, newItem])
  }

  if (parent !== container) {
    try {
      const currentDate = new Date().toISOString() // Получаем текущую дату в формате ISO

      const updatedData = {
        user: userID,
        title,
        description,
        type,
        status: container as string,
        date_inProgress,
        date_Done,
        date_ToDO,
      }

      if (container === 'в работе') {
        updatedData.date_inProgress = currentDate
        updatedData.date_Done = null
        updatedData.date_ToDO = null
      } else if (container === 'готово') {
        updatedData.date_Done = currentDate
        updatedData.date_ToDO = null
        updatedData.date_inProgress =  null
      } else if (container === 'к выполнению') {
        updatedData.date_ToDO = currentDate
        updatedData.date_Done = null
        updatedData.date_inProgress =  null
      }

      await dispatch(updateTask({
        taskId: _id,
        data: updatedData,
      }))
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error)
      alert('Ошибка при обновлении задачи')
    }
  }
}

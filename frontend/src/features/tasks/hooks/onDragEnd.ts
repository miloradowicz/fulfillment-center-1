import { Dispatch, SetStateAction } from 'react'
import { TaskWithPopulate } from '../../../types'
import { AppDispatch } from '../../../app/store'
import { updateTask } from '../../../store/thunks/tasksThunk.ts'
import { DragEndEvent } from '@dnd-kit/core'

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
  const container = e.over?.id
  const taskData = e.active?.data?.current
  if (!taskData) return

  const { _id, title, description, user, parent } = taskData
  const userID = user?._id ?? ''
  const userEmail = user?.email ?? ''
  const userName = user?.displayName ?? ''
  const userRole = user?.role ?? 'stock-worker'

  const removeTask = (items: TaskWithPopulate[]) => items.filter(item => item._id !== _id)

  if (parent === 'к выполнению') {
    setTodoItems(removeTask(todoItems))
  } else if (parent === 'готово') {
    setDoneItems(removeTask(doneItems))
  } else {
    setInProgressItems(removeTask(inProgressItems))
  }

  const newItem: TaskWithPopulate = {
    _id,
    title,
    description,
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
      await dispatch(updateTask({
        taskId: _id,
        data: {
          user: userID,
          title,
          description,
          status: container as string,
        },
      }))
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error)
      alert('Ошибка при обновлении задачи')
    }
  }
}

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
  const title = e.active?.data?.current?.title ?? ''
  const id = e.active?.data?.current?._id ?? ''
  const description = e.active?.data?.current?.description ?? ''
  const userName = e.active?.data?.current?.user.displayName ?? ''
  const userID = e.active?.data?.current?.user._id ?? ''
  const userEmail = e.active?.data?.current?.user.email ?? ''
  const userRole = e.active?.data?.current?.user.role ?? 'stock-worker'
  const index = e.active?.data?.current?.index ?? 0
  const parent = e.active?.data?.current?.parent ?? 'к выполнению'

  let updatedItems
  if (parent === 'к выполнению') {
    updatedItems = todoItems.filter((_, i) => i !== index)
    setTodoItems(updatedItems)
  } else if (parent === 'готово') {
    updatedItems = doneItems.filter((_, i) => i !== index)
    setDoneItems(updatedItems)
  } else {
    updatedItems = inProgressItems.filter((_, i) => i !== index)
    setInProgressItems(updatedItems)
  }

  const newItem: TaskWithPopulate = {
    _id: id,
    title: title,
    user: {
      _id: userID,
      email: userEmail,
      displayName: userName,
      role: userRole,
    },
    description: description,
    status: container as string,
  }

  try {
    const taskData = {
      taskId: id,
      data: {
        user: userID,
        title: title,
        description: description,
        status: container as string,
      },
    }

    await dispatch(updateTask(taskData))

    if (container === 'к выполнению') {
      setTodoItems(prev => [...prev, newItem])
    } else if (container === 'готово') {
      setDoneItems(prev => [...prev, newItem])
    } else {
      setInProgressItems(prev => [...prev, newItem])
    }
  } catch (error) {
    console.error('Ошибка при обновлении задачи:', error)
    alert('Ошибка при обновлении задачи')
  }
}

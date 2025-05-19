import { Dispatch, SetStateAction } from 'react'
import { TaskWithPopulate } from '@/types'
import { AppDispatch } from '@/app/store.ts'
import { updateTaskStatus } from '@/store/thunks/tasksThunk.ts'
import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

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

const findInsertIndex = (items: TaskWithPopulate[], overId: UniqueIdentifier) => {
  const overElement = document.getElementById(overId.toString()) as HTMLElement
  if (!overElement) return items.length

  const overElementRect = overElement.getBoundingClientRect()
  const midPoint = overElementRect.top + overElementRect.height / 2

  for (let i = 0; i < items.length; i++) {
    const itemElement = document.getElementById(items[i]._id) as HTMLElement
    if (!itemElement) continue

    const itemRect = itemElement.getBoundingClientRect()
    if (midPoint < itemRect.top + itemRect.height / 2) {
      return i
    }
  }

  return items.length
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
  if (!e.active) return

  const prevTodoItems = [...todoItems]
  const prevDoneItems = [...doneItems]
  const prevInProgressItems = [...inProgressItems]

  const taskData = e.active?.data?.current
  if (!taskData) return

  const { _id, parent } = taskData


  if (parent === e.over?.id) {
    setTodoItems(prevTodoItems)
    setDoneItems(prevDoneItems)
    setInProgressItems(prevInProgressItems)
    return
  }

  const { taskNumber, title, description, date_inProgress, date_Done, date_ToDO, type, associated_order, associated_arrival, createdAt, user } = taskData
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
    taskNumber,
    createdAt,
    updatedAt: currentTime.toISOString(),
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
    status: e.over?.id as string,
  }

  let insertIndex = 0

  if (!e.over) {
    setTodoItems(prevTodoItems)
    setDoneItems(prevDoneItems)
    setInProgressItems(prevInProgressItems)
    return
  }

  if (e.over?.id === 'к выполнению') {
    insertIndex = findInsertIndex(todoItems, e.active.id)
    setTodoItems(prev => {
      const updatedItems = [...prev]
      updatedItems.splice(insertIndex, 0, newItem)
      return updatedItems
    })
  } else if (e.over?.id === 'готово') {
    insertIndex = findInsertIndex(doneItems, e.active.id)
    setDoneItems(prev => {
      const updatedItems = [...prev]
      updatedItems.splice(insertIndex, 0, newItem)
      return updatedItems
    })
  } else if (e.over?.id === 'в работе') {
    insertIndex = findInsertIndex(inProgressItems, e.active.id)
    setInProgressItems(prev => {
      const updatedItems = [...prev]
      updatedItems.splice(insertIndex, 0, newItem)
      return updatedItems
    })
  }

  if (parent !== e.over?.id) {
    try {
      const currentDate = new Date().toISOString()
      const updatedData = {
        user: userID,
        title,
        description,
        type,
        associated_order: associated_order?._id ?? null,
        associated_arrival: associated_arrival?._id ?? null,
        status: e.over?.id as string,
        date_inProgress,
        date_Done,
        date_ToDO,
      }

      if (e.over?.id === 'в работе') {
        updatedData.date_inProgress = currentDate
        updatedData.date_Done = null
        updatedData.date_ToDO = null
      } else if (e.over?.id === 'готово') {
        updatedData.date_Done = currentDate
        updatedData.date_ToDO = null
        updatedData.date_inProgress = null
      } else if (e.over?.id === 'к выполнению') {
        updatedData.date_ToDO = currentDate
        updatedData.date_Done = null
        updatedData.date_inProgress = null
      }

      await dispatch(updateTaskStatus({
        taskId: _id,
        data: updatedData,
      }))
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error)
      toast.error('Ошибка при обновлении задачи')
    }
  }
}

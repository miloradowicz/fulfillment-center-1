import React, { useState } from 'react'
import { useAppDispatch } from '@/app/hooks.ts'
import { setDraggingTask } from '@/store/slices/taskSlice.ts'
import {
  archiveTask,
  fetchTasksByUserIdWithPopulate,
  fetchTasksWithPopulate,
} from '@/store/thunks/tasksThunk.ts'
import { toast } from 'react-toastify'
import { TaskWithPopulate } from '@/types'

const UseTaskCard = (task: TaskWithPopulate, selectedUser: string | null) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [tooltipText, setTooltipText] = useState('Скопировать ссылку')
  const [openTooltip, setOpenTooltip] = useState(false)
  const dispatch = useAppDispatch()

  const handleDragStart = () => {
    const taskWithDateAsString = {
      ...task,
      updatedAt: task.updatedAt.toString(),
    }
    dispatch(setDraggingTask(taskWithDateAsString))
  }

  const handleCopyLink = async (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    const url = `${ window.location.origin }/tasks/${ task._id }`

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setTooltipText('Скопировано')
      setOpenTooltip(true)
    } catch (err) {
      console.error('Ошибка при копировании:', err)
      setTooltipText('Ошибка при копировании')
      setOpenTooltip(true)
    }
  }

  const handleMouseOver = () => {
    setTooltipText('Скопировать ссылку')
  }

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation()
    setOpenEditModal(true)
  }

  const handleDelete = async () => {
    try {
      await dispatch(archiveTask(task._id))
      if (!selectedUser) {
        await dispatch(fetchTasksWithPopulate())
      } else {
        await dispatch(fetchTasksByUserIdWithPopulate(selectedUser))
      }
      toast.success('Задача перемещена в архив.')
    } catch (e) {
      console.error(e)
    }
    setOpenDeleteModal(false)
  }

  const handleCancelDelete = () => {
    setOpenDeleteModal(false)
  }

  return {
    openDeleteModal,
    openEditModal,
    openDetailModal,
    tooltipText,
    openTooltip,
    setOpenDetailModal,
    setOpenTooltip,
    setOpenEditModal,
    setOpenDeleteModal,
    handleDragStart,
    handleCopyLink,
    handleMouseOver,
    handleEdit,
    handleDelete,
    handleCancelDelete,
    dispatch,
  }
}

export default UseTaskCard

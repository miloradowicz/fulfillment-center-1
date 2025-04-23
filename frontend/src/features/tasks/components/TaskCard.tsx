import { useDraggable } from '@dnd-kit/core'
import { ClipboardList, Link2, ListTodo, MoreHorizontal, Pencil, Trash2, Truck } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CSS } from '@dnd-kit/utilities'
import React, { memo } from 'react'
import { TaskCardProps } from '../hooks/TypesProps'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { NavLink } from 'react-router-dom'
import StatusCell from './StatusCell.tsx'
import { Button } from '@/components/ui/button.tsx'
import TaskDetails from './TaskDetails.tsx'
import TaskForm from './TaskForm.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import useBreakpoint from '@/hooks/useBreakpoint.ts'
import UseTaskCard from '@/features/tasks/hooks/useTaskCard.ts'

const TaskCard: React.FC<TaskCardProps> =  memo(({ task, selectedUser, index, parent }) => {
  const { isMobile } = useBreakpoint()
  const {
    openDeleteModal,
    openEditModal,
    openDetailModal,
    tooltipText,
    openTooltip,
    setOpenDetailModal,
    setOpenEditModal,
    setOpenDeleteModal,
    setOpenTooltip,
    handleDragStart,
    handleCopyLink,
    handleMouseOver,
    handleEdit,
    handleDelete,
    handleCancelDelete,
  } = UseTaskCard(task, selectedUser)



  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
    data: {
      ...task,
      index,
      parent,
    },
    disabled: isMobile,
  })

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : 'none',
    touchAction: 'none',
  }

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

  return (
    <div
      id={task._id}
      ref={setNodeRef}
      className="rounded-[12px]
      shadow-[0_4px_10px_rgba(0,0,0,0.1)]
      bg-white
      mb-2
      relative
      cursor-grab
      touch-auto
      select-none
      "
      style={{
        transform: style.transform,
      }}
      {...attributes}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <div
        {...listeners}
        onMouseDown={handleDragStart}
      >
        <div className="bg-white p-4 rounded-xl">
          <div className="flex flex-row items-center gap-4" onClick={() => setOpenDetailModal(true)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-md cursor-pointer transition-colors group hover:text-blue-600">
                  {getTaskIcon(task.type, 'h-5 w-5 text-gray-700 transition-colors group-hover:text-blue-600')}
                  <h5>
                    <strong>{task.taskNumber}</strong>
                  </h5>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Детальный просмотр
              </TooltipContent>
            </Tooltip>
            <Tooltip open={openTooltip} onOpenChange={setOpenTooltip}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer hover:text-blue-600 hover:bg-transparent"
                  onClick={handleCopyLink}
                  onMouseOver={handleMouseOver}
                >
                  <Link2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {tooltipText}
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    setOpenDeleteModal(true)
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  Переместить в архив
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col gap-2">
            <p>{task.title}</p>
            {task.associated_arrival && (
              <NavLink to={`/arrivals/${ task.associated_arrival._id }`} target="_blank" className="text-blue-600 font-medium hover:underline underline-offset-4 self-start">
                {`Поставка ${ task.associated_arrival.arrivalNumber }`}
              </NavLink>
            )}
            {task.associated_order && (
              <NavLink to={`/orders/${ task.associated_order._id }`} target="_blank" className="text-blue-600 font-medium hover:underline underline-offset-4 self-start">
                {`Заказ ${ task.associated_order.orderNumber }`}
              </NavLink>
            )}
            <p className="text-[14px]">Исполнитель: <span className="font-bold">{task.user.displayName}</span></p>
          </div>
        </div>
        {isMobile && <StatusCell task={task} selectedUser={selectedUser} />}
      </div>
      <ConfirmationModal
        open={openDeleteModal}
        entityName="эту задачу"
        actionType="archive"
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />
      <Modal open={openEditModal} handleClose={() => setOpenEditModal(false)}>
        <TaskForm initialData={task} onSuccess={() => setOpenEditModal(false)}/>
      </Modal>
      <Modal open={openDetailModal} handleClose={() => setOpenDetailModal(false)}>
        <TaskDetails taskId={task._id}/>
      </Modal>
    </div>
  )
})

export default TaskCard

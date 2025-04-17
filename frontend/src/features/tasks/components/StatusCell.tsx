import { useAppDispatch } from '@/app/hooks.ts'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { SquareArrowOutDownRight } from 'lucide-react'
import { fetchTasksByUserIdWithPopulate, fetchTasksWithPopulate, updateTask } from '@/store/thunks/tasksThunk.ts'
import { PropsStatus } from '../hooks/TypesProps'

const StatusCell:React.FC<PropsStatus> =({ task, selectedUser  })  => {
  const dispatch = useAppDispatch()

  const statusColors: Record<string, string> = {
    'к выполнению': 'bg-yellow-300',
    'в работе': 'bg-blue-300',
    'готово': 'bg-green-300',
  }

  const status = task.status || 'к выполнению'
  const statusOptions = ['к выполнению', 'в работе', 'готово']

  const handleClose = async (newStatus?: string) => {
    if (newStatus && newStatus !== task.status) {
      const currentDate = new Date().toISOString()

      const updatedData = {
        ...task,
        associated_arrival: task.associated_arrival ? task.associated_arrival._id : null,
        associated_order: task.associated_order ? task.associated_order._id : null,
        user: task.user._id,
        status: newStatus,
      }

      if (newStatus === 'в работе') {
        updatedData.date_inProgress = currentDate
        updatedData.date_Done = null
        updatedData.date_ToDO = null
      } else if (newStatus === 'готово') {
        updatedData.date_Done = currentDate
        updatedData.date_ToDO = null
        updatedData.date_inProgress = null
      } else if (newStatus === 'к выполнению') {
        updatedData.date_ToDO = currentDate
        updatedData.date_Done = null
        updatedData.date_inProgress = null
      }
      await dispatch(updateTask({ taskId: task._id, data: updatedData })).unwrap()
      if (!selectedUser) {
        await dispatch(fetchTasksWithPopulate())
      } else {
        await dispatch(fetchTasksByUserIdWithPopulate(selectedUser))
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-[100%] w-[100%]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={`flex relative px-3 py-1.5 rounded-b-[12px] w-full cursor-pointer text-gray-700 text-sm ${ statusColors[status] }`}
          >
            <p className="uppercase font-bold text-center flex-1">{task.status}</p>
            <SquareArrowOutDownRight className="absolute right-4 top-2 w-4 h-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {statusOptions.map(option => (
            <DropdownMenuItem key={option} onClick={() => handleClose(option)}>
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default StatusCell

import { FC } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { TaskLineProps } from '../hooks/TypesProps'
import TaskCard from './TaskCard.tsx'
import { getStatusStyles } from '../utils/statusStyle.ts'
import TaskCardSceleton from './TaskCardSceleton.tsx'
import { useAppSelector } from '@/app/hooks.ts'
import { selectLoadingFetchTask } from '@/store/slices/taskSlice.ts'

const TaskLine: FC<TaskLineProps> = ({ title, items, selectedUser }) => {
  const loadingFetchTask = useAppSelector(selectLoadingFetchTask)
  const { setNodeRef } = useDroppable({
    id: title,
  })

  const statusStyles = getStatusStyles(title)

  return (
    <div  className="flex flex-col p-4 min-h-[300px] space-y-4">
      <div
        ref={setNodeRef}
        className="bg-[#f7f7f7] rounded-xl py-4 flex flex-col shadow-md"
      >
        <div className="flex items-center justify-start mb-3 ml-6 gap-2.5">
          <h6 className="font-bold text-[15px] uppercase spacing rounded-[5px] px-[6px]"
            style={{
              ...statusStyles,
            }}
          >
            {title}
          </h6>
          <p className="text-xl text-[#44546F]">{items.length}</p>
        </div>
        <div className="overflow-y-auto max-h-[72vh] px-2">
          {loadingFetchTask ? (
            <TaskCardSceleton />
          ) : (
            items.map((task, key) => (
              <TaskCard selectedUser={selectedUser} key={task._id} index={key} parent={title} task={task} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskLine

import { FC, memo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { TaskLineProps } from '../hooks/TypesProps'
import TaskCard from './TaskCard.tsx'
import { getStatusStyles } from '../utils/statusStyle.ts'
import TaskCardSceleton from './TaskCardSceleton.tsx'
import { useAppSelector } from '@/app/hooks.ts'
import { selectLoadingFetchTask } from '@/store/slices/taskSlice.ts'
import useBreakpoint from '@/hooks/useBreakpoint.ts'

const TaskLine: FC<TaskLineProps> = memo(({ title, items, selectedUser, activeColumnId }) => {
  const loadingFetchTask = useAppSelector(selectLoadingFetchTask)
  const { setNodeRef } = useDroppable({
    id: title,
  })
  const { isMobile } = useBreakpoint()

  const isActive = activeColumnId === title

  return (
    <div className="flex flex-col p-4 min-h-[300px] space-y-4">
      <div
        ref={setNodeRef}
        className={`bg-[#f7f7f7] border-2  rounded-xl py-4 flex flex-col shadow-md transition-all duration-300 ${
          isActive ? 'border-1 border-blue-500 bg-blue-50' : ''
        }`}
      >
        <div className="flex items-center justify-start mb-3 ml-6 gap-2.5">
          <h6 className={`font-semibold text-[16px] uppercase spacing rounded-[5px] px-[6px] ${ getStatusStyles(title) }`}
          >
            {title}
          </h6>
          <p className="text-xl text-[#44546F]">{items.length}</p>
        </div>
        <div className="overflow-y-auto overflow-x-hidden px-2" style={{
          maxHeight: isMobile ? '60vh' : '69vh',
          WebkitOverflowScrolling: 'touch',
          position: 'relative',
        }}>
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
})

export default TaskLine

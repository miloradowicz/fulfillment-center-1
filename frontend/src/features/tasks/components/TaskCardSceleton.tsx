import { Skeleton } from '@/components/ui/skeleton'

const TaskCardSkeleton = () => {
  return (
    <div className="rounded-xl shadow-md bg-white p-6 mb-4 space-y-3">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-10 w-4/5 rounded-md" />
    </div>
  )
}

export default TaskCardSkeleton

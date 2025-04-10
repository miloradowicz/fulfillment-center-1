import { TaskWithPopulate, UserStripped } from '@/types'

export interface TaskLineProps {
  title: string;
  items: TaskWithPopulate[];
  selectedUser: string | null
}

export interface TaskCardProps {
  task: TaskWithPopulate
  index: number
  parent: string
  selectedUser: string | null
}

export interface UserListProps {
  users: UserStripped[]
  selectedUser: string | null
  setSelectedUser: (userId: string | null) => void
}

export interface PropsStatus {
  task: TaskWithPopulate,
  selectedUser: string | null
}

import { TaskWithPopulate } from '../../../types'

export interface TaskLineProps {
  title: string;
  items: TaskWithPopulate[];
}

export interface TaskCardProps {
  task: TaskWithPopulate
  index: number
  parent: string
}

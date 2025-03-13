import { TaskWithPopulate } from '../../../types'

export interface KanbanLaneProps {
  title: string;
  items: TaskWithPopulate[];
}

export interface KanbanCardProps {
  task: TaskWithPopulate
  index: number
  parent: string
}

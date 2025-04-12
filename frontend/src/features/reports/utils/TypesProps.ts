import { ClientOrderReport, TaskWithPopulate, UserTaskReport } from '@/types'

export interface DailyTaskCount {
  date: string;
  taskCount: number;
}

export interface PropsCountChart {
  data: DailyTaskCount[];
}

export interface PropsTaskTable {
  userTaskReports:  UserTaskReport[]
}

export interface TaskSummaryProps {
  tasks: TaskWithPopulate[] | null;
}

export interface PropsClientTable {
  clientOrderReport:  ClientOrderReport[]
}

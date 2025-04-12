import { coefficient, maxWidth, mdWidth, middleWidth, minWidth } from '../utils/taskReportConstants.ts'
import { useWindowWidth } from './useWndowWidth.ts'
import { TaskSummaryProps } from '../utils/TypesProps.ts'
import { useResponsiveState } from './usePesponsiveState.ts'

export const useTaskStateForReport = ({ tasks }: TaskSummaryProps) => {
  const chartWidth = useResponsiveState(
    middleWidth,
    minWidth,
    maxWidth,
    coefficient,
  )
  const width = useWindowWidth()
  const isMobile = width < mdWidth
  const taskStats = tasks?.reduce(
    (acc, task) => {
      if (task.status === 'к выполнению') acc.toDo++
      else if (task.status === 'в работе') acc.inProgress++
      else if (task.status === 'готово') acc.completed++
      return acc
    },
    { toDo: 0, inProgress: 0, completed: 0 },
  ) || { toDo: 0, inProgress: 0, completed: 0 }

  const totalTasks = taskStats.toDo + taskStats.inProgress + taskStats.completed

  const chartData = [
    {
      id: 0,
      value: taskStats.toDo,
      label: isMobile ? `К выполнению (${ taskStats.toDo })` : 'К выполнению',
    },
    {
      id: 1,
      value: taskStats.inProgress,
      label: isMobile ? `В работе (${ taskStats.inProgress })` : 'В работе',
    },
    {
      id: 2,
      value: taskStats.completed,
      label: isMobile ? `Готово (${ taskStats.completed })` : 'Готово',
    },
  ]
  return {
    totalTasks,
    chartData,
    chartWidth,
    taskStats,
    isMobile,
  }
}

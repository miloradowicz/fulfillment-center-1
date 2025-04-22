import { TaskSummaryProps } from '../utils/TypesProps.ts'
import { ChartConfig } from '@/components/ui/chart.tsx'
import useBreakpoint from '@/hooks/useBreakpoint.ts'

export const usePieChart = ({ tasks }: TaskSummaryProps) => {
  const isMobileSm = useBreakpoint()
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
      label: `К выполнению (${ taskStats.toDo })`,
      fill: 'var(--color-chart-1)',
    },
    {
      id: 1,
      value: taskStats.inProgress,
      label: `В работе (${ taskStats.inProgress })`,
      fill: 'var(--color-chart-3)',
    },
    {
      id: 2,
      value: taskStats.completed,
      label: `Готово (${ taskStats.completed })`,
      fill: 'var(--color-chart-2)',
    },
  ]

  const chartConfig: ChartConfig = {
    visitors: {
      label: 'Всего задач',
    },
    toDo: {
      label: 'К выполнению',
      color: 'hsl(var(--chart-1))',
    },
    inProgress: {
      label: 'В работе',
      color: 'hsl(var(--chart-2))',
    },
    completed: {
      label: 'Готово',
      color: 'hsl(var(--chart-3))',
    },
  }
  return {
    totalTasks,
    chartData,
    isMobileSm,
    chartConfig,
  }
}


import { Pie, PieChart, Cell, Legend, PieLabelRenderProps, ResponsiveContainer } from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import React from 'react'
import { TaskSummaryProps } from '@/features/reports/utils/TypesProps.ts'
import { useTaskStateForReport } from '@/features/reports/hooks/useTaskStateForReport.ts'
import useIsMobile from '@/features/reports/utils/UseIMobile.ts'


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

export const TaskPieChart:React.FC<TaskSummaryProps>  = ({ tasks }) => {
  const isMobile = useIsMobile('sm')
  const {
    totalTasks,
    taskStats,
  } = useTaskStateForReport({ tasks })
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
      fill: 'var(--color-chart-2)',
    },
    {
      id: 2,
      value: taskStats.completed,
      label: `Готово (${ taskStats.completed })`,
      fill: 'var(--color-chart-3)',
    },
  ]

  const renderInnerLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    value,
  }: PieLabelRenderProps) => {
    const r = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5
    const x = Number(cx) + r * Math.cos(-midAngle * (Math.PI / 180))
    const y = Number(cy) + r * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={16}
        fontWeight="400"
      >
        {value}
      </text>
    )
  }

  return (
    <Card className="w-[330px] sm:w-full min-w-[330px] max-w-[500px] ">
      <CardHeader className="items-center pb-0 mt-3">
        <CardTitle>Всего задач {totalTasks}</CardTitle>
      </CardHeader>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[320px]  [&_.recharts-pie-label-text]:fill-foreground pt-0 w-full sm:w-[500px] h-[315px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label={renderInnerLabel} labelLine={false}
            >
              {chartData.map(entry => (
                <Cell key={`cell-${ entry.id }`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              layout={'vertical'}
              align={isMobile?'center':'right'}
              verticalAlign={isMobile?'bottom':'middle'}
              iconType='circle'
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}

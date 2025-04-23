import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import React from 'react'
import { TaskSummaryProps } from '@/features/reports/utils/TypesProps.ts'
import { usePieChart } from '@/features/reports/hooks/usePieChart.ts'
import RenderInnerLabel from './RenderInnerLableForChart'

export const TaskPieChart:React.FC<TaskSummaryProps>  = ({ tasks }) => {

  const {
    totalTasks,
    chartData,
    chartConfig,
    isMobileSm,
  } = usePieChart({ tasks })

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
              label={RenderInnerLabel} labelLine={false}
            >
              {chartData.map(entry => (
                <Cell key={`cell-${ entry.id }`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              layout={'vertical'}
              align={isMobileSm.isMobileSm?'center':'right'}
              verticalAlign={isMobileSm.isMobileSm?'bottom':'middle'}
              iconType='circle'
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}

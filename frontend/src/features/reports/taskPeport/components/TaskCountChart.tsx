import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { PropsCountChart } from '../../utils/TypesProps.ts'
import { useTaskCountAreaChart } from '../../hooks/useTaskCountAreaChart.ts'

const TaskCountAreaChart: React.FC<PropsCountChart> = ({ data }) => {

  const { containerHeight,
    chartData,
    startDate,
    endDate, margin } = useTaskCountAreaChart({ data })


  return (
    <div className={'mb-5'}>
      {data.length === 0 ? null : (
        <>
          <h6
            className="mx-auto xl:mx-5 w-[80%] sm:w-[90%] md:w-[80%] lg:w-[80%] xl:w-[80%] mb-[15px] text-[1rem] sm:text-[1.25rem] text-center"
          >
          Ежедневная динамика общего количества задач за
          период с {startDate} по {endDate}
          </h6>
          <Card className="mx-auto xl:mx-0 overflow-x-auto min-w-[300px] max-w-[500px] md:w-full">
            <CardContent>
              <ResponsiveContainer width="100%" height={containerHeight} style={{ margin: '20px 0', paddingBottom: '10px' }}>
                <AreaChart data={chartData}  margin={margin}>
                  <defs>
                    <linearGradient id="colorTaskCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={0}
                    textAnchor="middle"
                    tickSize={10}
                    tickMargin={15}
                    height={30}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickMargin={15}
                    tickFormatter={(tick: number) => {
                      return Number.isInteger(tick) ? tick.toString() : ''
                    }}
                  />
                  <Tooltip formatter={value => [`${ value }`, 'Количество задач']} />
                  <Area
                    type="monotone"
                    dataKey="taskCount"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorTaskCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>)}
    </div>
  )
}

export default TaskCountAreaChart

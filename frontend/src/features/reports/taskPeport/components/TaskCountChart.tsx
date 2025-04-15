import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { PropsCountChart } from '../../utils/TypesProps.ts'
import { useTaskCountAreaChart } from '../../hooks/useTaskCountAreaChart.ts'

const TaskCountAreaChart: React.FC<PropsCountChart> = ({ data }) => {

  const { containerHeight,
    chartData,
    startDate,
    endDate } = useTaskCountAreaChart({ data })

  return (
    <div className={'mb-5'}>
      {data.length === 0 ? null : (
        <>
          <h6
            className="mx-auto w-[90%] sm:w-[80%] md:w-[95%] lg:w-[95%] xl:w-[95%] mb-[15px] text-[1rem] sm:text-[1.25rem] text-center"
          >
          Ежедневная динамика общего количества задач за
          период с {startDate} по {endDate}
          </h6>
          <Card>
            <CardContent>
              <ResponsiveContainer width="100%" height={containerHeight} style={{ margin: '20px 0', paddingBottom: '10px' }}>
                <AreaChart data={chartData} margin={{ bottom: 10 }}>
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
                    interval={Math.ceil(data.length / 10)}
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

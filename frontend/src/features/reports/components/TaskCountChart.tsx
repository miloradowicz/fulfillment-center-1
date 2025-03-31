import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { formatDate } from '../utils/FormattedDateForTitle.ts'
import { PropsCountChart } from '../utils/TypesProps.ts'

const TaskCountAreaChart: React.FC<PropsCountChart> = ({ data }) => {
  const chartData = data.map(item => ({
    date: item.date,
    taskCount: item.taskCount,
  }))

  const [searchParams] = useSearchParams()
  const startDate = formatDate(searchParams.get('startDate'))
  const endDate = formatDate(searchParams.get('endDate'))

  return (
    <>{data.length === 0 ? null: <Box style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>
      <Typography variant={'h6'} style={{ marginBottom: '10px' }}>Ежедневная динамика общего количества <br/> выполненных задач за период c {startDate} по {endDate}</Typography>
      <ResponsiveContainer width={'100%'}  height={400}
        style={{ margin: '20px 0', paddingBottom: '30px' }}>
        <AreaChart data={chartData} margin={{ bottom: 50 }}>
          <defs>
            <linearGradient id="colorTaskCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            tickSize={10}
            height={50}
            interval={Math.ceil(data.length / 10)}
          />
          <YAxis/>
          <Tooltip formatter={value => [`${ value }`, 'Количество задач']}/>
          <Area
            type="monotone"
            dataKey="taskCount"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorTaskCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>}
    </>
  )
}

export default TaskCountAreaChart

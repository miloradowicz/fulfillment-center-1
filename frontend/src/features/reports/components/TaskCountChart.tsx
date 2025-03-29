import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DailyTaskCount {
  date: string;
  taskCount: number;
}

interface Props {
  data: DailyTaskCount[];
}

const TaskCountChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map(item => ({
    date: item.date,
    taskCount: item.taskCount,
  }))

  return (
    <ResponsiveContainer width="100%" height={300} >
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          angle={-45}
          textAnchor="end"
          tickSize={10}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="taskCount"
          stroke="#8884d8"
          fillOpacity={0.3}
          fill="url(#colorTaskCount)"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TaskCountChart

import React from 'react'
import { PieChart } from '@mui/x-charts'
import Box from '@mui/material/Box'
import { Card, Typography } from '@mui/material'
import { TaskSummaryProps } from '../utils/TypesProps.ts'

const TaskStateForReport: React.FC<TaskSummaryProps> = ({ tasks }) => {
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
    { id: 0, value: taskStats.toDo, label: 'К выполнению' },
    { id: 1, value: taskStats.inProgress, label: 'В работе' },
    { id: 2, value: taskStats.completed, label: 'Готово' },
  ]

  return (
    <Card style={{ height:'360px' }}>
      <Typography variant={'h6'} className="text-xl text-center font-bold mb-2">Всего задач: {totalTasks}</Typography>
      <Box className="flex flex-row items-center p-4  ">
        <Box className="flex flex-col mb-4 w-[35%]">
          <Box className="text-center bg-white p-4 rounded-lg shadow-sm mt-2">
            <h4 className="text-lg font-bold">К выполнению</h4>
            <p className="text-lg">{taskStats.toDo} задач(a)</p>
          </Box>
          <Box className="text-center bg-white p-4 rounded-lg shadow-sm mt-2">
            <h4 className="text-lg font-bold ">В работе</h4>
            <p className=" text-lg">{taskStats.inProgress} задач(a)</p>
          </Box>
          <Box className="text-center bg-white p-4 rounded-lg shadow-sm mt-2">
            <h4 className="text-lg font-bold">Готово</h4>
            <p className=" text-lg">{taskStats.completed} задач(a)</p>
          </Box>
        </Box>
        <PieChart series={[{ data: chartData }]} width={550} height={300}   colors={['#FFA07A', '#3679a1', '#008B8B']} />
      </Box>
    </Card>
  )
}

export default TaskStateForReport

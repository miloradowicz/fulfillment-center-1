import React from 'react'
import { PieChart } from '@mui/x-charts'
import Box from '@mui/material/Box'
import { Card, Typography } from '@mui/material'
import { TaskSummaryProps } from '../utils/TypesProps.ts'
import { useTaskStateForReport } from '../hooks/useTaskStateForReport.ts'

const TaskStateForReport: React.FC<TaskSummaryProps> = ({ tasks }) => {
  const {
    totalTasks,
    chartData,
    chartWidth,
    taskStats,
    isMobile,
  } = useTaskStateForReport({ tasks })

  return (
    <Card sx={{
      height: 'auto',
      minHeight: '200px',
      '@media (min-width: 768px)': {
        height: 'auto',
      },
      '@media (min-width: 1280px)': {
        height: '360px',
      },
    }}  >
      <Typography
        variant="h6"
        sx={{
          marginTop: { xs: '15px', sm: '10px' },
          fontSize: { xs: '1rem', sm: '1.25rem' },
          textAlign: 'center',
        }}
      >
        Всего задач {totalTasks}
      </Typography>
      <Box className="flex xl:flex-row sm:flex-col items-center xl:p-3 md:p-2 sm:p-0 xs:p-0  ">
        <Box
          className="hidden sm:hidden md:flex xl:w-[35%] xl:flex-col md:flex-row sm:w-[100%] mb-4 md:mb-4 md:justify-between sm:justify-between">
          <Box
            className="text-center bg-white p-4 rounded-lg shadow-sm xl:mt-2 md:mt-0 xl:w-[170px]  md:w-[30%] sm:w-[30%]"
            sx={{
              padding: { xs: 1, sm: 1, md: 1, xl: 2 },
              fontSize: { xs: '0.875rem', md: '1rem' },
            }}>
            <h4 className="text-base md:text-lg font-bold">К выполнению</h4>
            <p className="ext-sm sm:text-lg">{taskStats.toDo} задач(a)</p>
          </Box>
          <Box
            className="text-center bg-white p-4 rounded-lg shadow-sm xl:mt-2 md:mt-0 xl:w-[170px] md:w-[30%] sm:w-[30%]"
            sx={{
              padding: { xs: 1, sm: 1, md: 1, xl: 2 },
              fontSize: { xs: '0.875rem', md: '1rem' },
            }}>
            <h4 className="text-base md:text-lg font-bold">В работе</h4>
            <p className=" ext-sm sm:text-lg">{taskStats.inProgress} задач(a)</p>
          </Box>
          <Box
            className="text-center bg-white rounded-lg shadow-sm xl:mt-2 xl:w-[170px] md:mt-0 md:w-[30%] sm:w-[30%]"
            sx={{
              padding: { xs: 1, sm: 1, md: 1, xl: 2 },
              fontSize: { xs: '0.875rem', md: '1rem' },
            }}
          >
            <h4 className="text-base md:text-lg font-bold">Готово</h4>
            <p className="text-sm sm:text-lg">{taskStats.completed} задач(a)</p>
          </Box>
        </Box>

        <PieChart
          series={[{ data: chartData }]}
          width={chartWidth}
          height={isMobile ? 250 : 300}
          colors={['#FFA07A', '#3679a1', '#008B8B']}
          margin={{
            top:isMobile ? 80 : 5 ,
            right: isMobile ? 5: 180,
            bottom: 10,
            left: 5,
          }}
          slotProps={{
            legend: {
              labelStyle: {
                tableLayout: 'fixed',
                textAlign: 'center',
              },
              direction: isMobile ? 'row' : 'column',
              position: {
                horizontal: isMobile ?'middle' : 'right',
                vertical: isMobile ? 'top' : 'middle',
              },
            },
          }}/>

      </Box>
    </Card>
  )
}

export default TaskStateForReport

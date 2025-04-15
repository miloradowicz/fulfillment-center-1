// import React from 'react'
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// import Box from '@mui/material/Box'
// import {  Typography } from '@mui/material'
// import { PropsCountChart } from '../../utils/TypesProps.ts'
//
// import { useTaskCountAreaChart } from '../../hooks/useTaskCountAreaChart.ts'
//
// const TaskCountAreaChart: React.FC<PropsCountChart> = ({ data }) => {
//
//   const { containerHeight,
//     chartData,
//     startDate,
//     endDate } = useTaskCountAreaChart({ data })
//
//   return (
//     <>{data.length === 0 ? null: <Box style={{ textAlign: 'center', width: '100%' }}>
//       <Typography
//         variant="h6"
//         sx={{
//           marginInline:'auto',
//           width:{ xs:'90%', sm: '85%', xl: '85%', lg: '85%', md:'85%' },
//           marginBottom: { xs: '5px', sm: '10px' },
//           fontSize: { xs: '1rem', sm: '1.25rem' },
//           textAlign: 'center',
//         }}
//       >
//         Ежедневная динамика общего количества {' '}
//        выполненных задач за период c {startDate} по {endDate}
//       </Typography>
//       <ResponsiveContainer width="100%"
//         height={containerHeight}
//         style={{ margin: '20px 0', paddingBottom: '10px' }}>
//         <AreaChart data={chartData} margin={{ bottom: 10 }}>
//           <defs>
//             <linearGradient id="colorTaskCount" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
//               <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
//             </linearGradient>
//           </defs>
//           <CartesianGrid strokeDasharray="3 3"/>
//           <XAxis
//             dataKey="date"
//             angle={0}
//             textAnchor={ 'middle'}
//             tickSize={10}
//             tickMargin={ 15 }
//             height={ 30 }
//             interval={Math.ceil(data.length / 10)}
//           />
//           <YAxis
//             tickMargin={ 15 }
//             tickFormatter={(tick: number) => {
//               return Number.isInteger(tick) ? tick.toString() : ''
//             }}/>
//           <Tooltip formatter={value => [`${ value }`, 'Количество задач']}/>
//           <Area
//             type="monotone"
//             dataKey="taskCount"
//             stroke="#8884d8"
//             fillOpacity={1}
//             fill="url(#colorTaskCount)"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </Box>}
//     </>
//   )
// }
//
// export default TaskCountAreaChart
import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { PropsCountChart } from '../../utils/TypesProps.ts'
import { useTaskCountAreaChart } from '../../hooks/useTaskCountAreaChart.ts'

const TaskCountAreaChart: React.FC<PropsCountChart> = ({ data }) => {

  const { containerHeight,
    chartData,
    startDate,
    endDate } = useTaskCountAreaChart({ data })

  return (
    <>
      {data.length === 0 ? null : (
        <Card>
          <CardHeader>
            <CardTitle>
              Ежедневная динамика общего количества задач
            </CardTitle>
            <CardDescription>
              Период с {startDate} по {endDate}
            </CardDescription>
          </CardHeader>

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
      )}
    </>
  )
}

export default TaskCountAreaChart

import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useSearchParams } from 'react-router-dom'
import { formatDate } from '../utils/FormattedDateForTitle.ts'
import { PropsTaskTable } from '../utils/TypesProps.ts'
import TaskDropdown from './TaskDropdown.tsx'

const TaskReportTable: React.FC<PropsTaskTable> = ({ userTaskReports }) => {
  const [searchParams] = useSearchParams()
  const startDate = formatDate(searchParams.get('startDate'))
  const endDate = formatDate(searchParams.get('endDate'))
  return (
    <>{userTaskReports.length === 0 ? null:
      <Box style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>
        <Typography variant={'h6'} style={{ marginBottom: '10px' }}>Количество задач, выполненных каждым <br/> сотрудником
          за период с {startDate} по {endDate}</Typography>
        <TableContainer component={Paper} sx={{ maxWidth: 650, marginInline:'auto' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize:'17px', fontWeight:'550' }}>Имя пользователя</TableCell>
                <TableCell sx={{ fontSize: '17px', fontWeight: '550' }} align="center">Выполненные <br/> задачи</TableCell>
                <TableCell sx={{ fontSize:'17px', fontWeight:'550' }} align="center">Количество <br/> выполеннных задач</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userTaskReports.map(report => (
                <TableRow key={report.user._id}>
                  <TableCell sx={{ fontSize: '17px' }} component="th" scope="row">
                    {report.user.displayName}
                  </TableCell>
                  <TableCell sx={{ fontSize: '17px' }} align="center">
                    <TaskDropdown tasks={report.tasks} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '17px' }} align="center">
                    {report.taskCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    }
    </>
  )
}

export default TaskReportTable

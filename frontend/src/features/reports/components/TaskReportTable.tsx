import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material'
import { UserTaskReport } from '../../../types'
import Box from '@mui/material/Box'

interface Props {
  userTaskReports:  UserTaskReport[]
}

const TaskReportTable: React.FC<Props> = ({ userTaskReports }) => {
  return (
    <>{userTaskReports.length === 0 ? null:
      <Box style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>
        <Typography variant={'h6'} style={{ marginBottom: '10px' }}>Количество задач выполненных каждым <br/> сотрудником
            за указанный
            период</Typography>
        <TableContainer component={Paper} sx={{ maxWidth: 650, marginInline:'auto' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize:'17px', fontWeight:'550' }}>Имя пользователя</TableCell>
                <TableCell sx={{ fontSize:'17px', fontWeight:'550' }} align="right">Количество выполеннных задач</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userTaskReports.map(report => (
                <TableRow key={report.user._id}>
                  <TableCell  sx={{ fontSize:'17px' }} component="th" scope="row">
                    {report.user.displayName}
                  </TableCell>
                  <TableCell sx={{ fontSize:'17px' }} align="right">{report.taskCount}</TableCell>
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

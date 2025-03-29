import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { UserTaskReport } from '../../../types'

interface Props {
  userTaskReports:  UserTaskReport[]
}

const TaskReportTable: React.FC<Props> = ({ userTaskReports }) => {
  return (
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
  )
}

export default TaskReportTable

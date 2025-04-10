import React from 'react'
import { Log, LogWithPopulate } from '@/types'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import dayjs from 'dayjs'

interface Props {
  logs: LogWithPopulate[] | Log[]
}

const LogsTable: React.FC<Props> = ({ logs }) => {

  if (logs.length === 0) {
    return (
      <Typography variant="body1" className="text-gray-500">
        История изменений отсутствует
      </Typography>
    )
  }
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '30%' }}>Пользователь</TableCell>
            <TableCell sx={{ width: '50%' }}>Изменение</TableCell>
            <TableCell sx={{ width: '20%' }} align="right">Дата</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={index}>
              <TableCell>{typeof log.user === 'object' ? log.user.displayName : log.user}</TableCell>
              <TableCell>{log.change}</TableCell>
              <TableCell align="right" className="text-gray-500 text-sm">
                {dayjs(log.date).format('DD.MM.YYYY HH:mm')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default LogsTable

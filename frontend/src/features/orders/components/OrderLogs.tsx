import React from 'react'
import { Log } from '@/types'
import { List, ListItem, Typography } from '@mui/material'
import dayjs from 'dayjs'

interface Props {
  logs: Log[] | [];
}

const OrderLogs: React.FC<Props> = ({ logs }) => {

  if (logs.length === 0) {
    return (
      <Typography variant="body1" className="text-gray-500">
        История изменений отсутствует
      </Typography>
    )
  }
  return (
    <List className="mt-2 space-y-2">
      {logs.map((log, index) => (
        <ListItem key={index} className="text-gray-700 border-b py-2">
          <strong>{log.user}:</strong> {log.change}
          <span className="text-gray-500 text-sm">({dayjs(log.date).format('DD.MM.YYYY HH:mm')})</span>
        </ListItem>
      ))}
    </List>
  )
}

export default OrderLogs

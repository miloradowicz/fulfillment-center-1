import { TaskWithPopulate } from '../../../types'
import React from 'react'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ruRU } from '@mui/x-data-grid/locales'
import dayjs from 'dayjs'

interface Props {
  tasks: TaskWithPopulate[] | []
}

const TasksList: React.FC<Props> = ({ tasks }) => {
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

  const columns: GridColDef<TaskWithPopulate>[] = [
    {
      field: 'user',
      headerName: 'Исполнитель',
      flex: 0.2,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
      editable: false,
      filterable: true,
      valueGetter: (_value: string, row: TaskWithPopulate) => row.user.displayName,
    },
    {
      field: 'title',
      headerName: 'Содержание',
      flex: 0.2,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
      editable: false,
      filterable: true,
      valueGetter: (_value: string, row: TaskWithPopulate) => row.title,
    },
    {
      field: 'status',
      headerName: 'Статус',
      flex: 0.1,
      minWidth: isMediumScreen ? 120 : 100,
      align: 'left',
      headerAlign: 'left',
      filterable: true,
      valueGetter: (_value: string, row: TaskWithPopulate) => row.status,
    },
    {
      field: 'createdАt',
      headerName: 'Создано',
      flex: 0.1,
      minWidth: isMediumScreen ? 120 : 100,
      align: 'left',
      headerAlign: 'left',
      valueGetter: (_value: string, row: TaskWithPopulate) => row.createdAt && new Date(row.createdAt),
      valueFormatter: (value: Date | null) => (value ? dayjs(value).format('DD.MM.YYYY') : 'Не доставлен'),
    },
    {
      field: 'updatedАt',
      headerName: 'Исполнено',
      flex: 0.1,
      minWidth: isMediumScreen ? 120 : 100,
      align: 'left',
      headerAlign: 'left',
      valueGetter: (_value: string, row: TaskWithPopulate) => {
        return row.status === 'готово' && row.updatedAt ? new Date(row.updatedAt) : null
      },
      valueFormatter: (value: Date | null) => {
        return value ? dayjs(value).format('DD.MM.YYYY') : 'Не выполнена'
      },
    },
  ]

  return (
    <Box className="max-w-[1000px] mx-auto w-full">
      {tasks ? (
        <DataGrid
          getRowId={row => row._id}
          rows={tasks}
          columns={columns}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      ) : (
        <Typography className="text-center mt-5">Задачи не найдены.</Typography>
      )}

    </Box>
  )
}

export default TasksList

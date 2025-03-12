import { useArrivalsList } from '../hooks/useArrivalsList.ts'
import { ArrivalWithClient } from '../../../types'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import { NavLink } from 'react-router-dom'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { ruRU } from '@mui/x-data-grid/locales'

const ArrivalsDataList = () => {
  const { arrivals, deleteOneArrival } = useArrivalsList()

  const columns: GridColDef<ArrivalWithClient>[] = [
    {
      field: 'client',
      headerName: 'Клиент',
      flex: 1,
      editable: false,
      filterable: true,
      valueGetter: (_value: string, row: ArrivalWithClient) => row.client?.name ?? 'Неизвестный клиент',
    },
    {
      field: 'arrival_date',
      headerName: 'Дата поставки',
      flex: 1,
      editable: false,
      type: 'date',
      valueGetter: (_value: string, row: ArrivalWithClient) => new Date(row.arrival_date),
      valueFormatter: row => dayjs(row).format('DD.MM.YYYY'),
    },
    {
      field: 'arrival_price',
      headerName: 'Стоимость доставки',
      flex: 1,
      type: 'number',
    },
    {
      field: 'sent_amount',
      headerName: 'Отправлено',
      width: 120,
      filterable: true,
      valueGetter: (_value: string, row: ArrivalWithClient) => row.sent_amount,
    },
    {
      field: 'defects',
      headerName: 'Дефекты',
      width: 100,
      valueGetter: (_value: string, row: ArrivalWithClient) => row.defects.length,
      filterable: false,
    },
    {
      field: 'arrival_status',
      headerName: 'Статус',
      flex: 1,
      renderCell: ({ row }) => {
        const statusColors: Record<string, 'warning' | 'success' | 'info' | 'default'> = {
          'ожидается доставка': 'warning',
          'получена': 'success',
          'отсортирована': 'info',
        }

        const status = row.arrival_status || 'В обработке'

        return <Chip className="capitalize" label={status} color={statusColors[status] ?? 'default'} />
      },
    },
    {
      field: 'products',
      headerName: 'Товаров',
      width: 100,
      valueGetter: (_value: string, row: ArrivalWithClient) => row.products.length,
    },
    {
      field: 'Actions',
      headerName: '',
      width: 210,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        return (
          <>
            <IconButton>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => deleteOneArrival(row._id)}>
              <ClearIcon />
            </IconButton>
            <NavLink className="text-gray-500 hover:text-gray-700 ml-2" to={`/arrivals/${ row._id }`}>
              Подробнее
            </NavLink>
          </>
        )
      },
    },
  ]

  return (
    <Box className="max-w-[1000px] mx-auto w-full">
      {arrivals ? (
        <DataGrid
          getRowId={row => row._id}
          rows={arrivals}
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
        <Typography className="text-center mt-5">Поставки не найдены.</Typography>
      )}
    </Box>
  )
}

export default ArrivalsDataList

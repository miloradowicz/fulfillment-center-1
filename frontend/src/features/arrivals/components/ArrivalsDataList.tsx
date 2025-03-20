import { useArrivalsList } from '../hooks/useArrivalsList.ts'
import { ArrivalWithClient } from '../../../types'
import { Box, Chip, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import { NavLink } from 'react-router-dom'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { ruRU } from '@mui/x-data-grid/locales'
import React from 'react'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import ArrivalForm from './ArrivalForm.tsx'

interface Props {
  onEdit: (data: ArrivalWithClient) => void
}

const ArrivalsDataList: React.FC<Props> = ({ onEdit }) => {
  const { arrivals, deleteOneArrival, handleClose, isOpen } = useArrivalsList()

  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))


  const columns: GridColDef<ArrivalWithClient>[] = [
    {
      field: 'client',
      headerName: 'Клиент',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
      editable: false,
      filterable: true,
      valueGetter: (_value: string, row: ArrivalWithClient) => row.client?.name ?? 'Неизвестный клиент',
    },
    {
      field: 'arrival_date',
      headerName: 'Дата поставки',
      flex: 1,
      minWidth: isMediumScreen ? 140 : 100,
      align: 'left',
      headerAlign: 'left',
      editable: false,
      type: 'date',
      valueGetter: (_value: string, row: ArrivalWithClient) => new Date(row.arrival_date),
      valueFormatter: row => dayjs(row).format('DD.MM.YYYY'),
    },
    {
      field: 'arrival_price',
      headerName: 'Стоимость доставки',
      flex: 1,
      minWidth: isMediumScreen ? 170 : 140,
      align: 'left',
      headerAlign: 'left',
      type: 'number',
    },
    {
      field: 'sent_amount',
      headerName: 'Отправлено',
      flex: 1,
      minWidth: isMediumScreen ? 160 : 100,
      align: 'left',
      headerAlign: 'left',
      filterable: true,
      valueGetter: (_value: string, row: ArrivalWithClient) => row.sent_amount,
    },
    {
      field: 'arrival_status',
      headerName: 'Статус',
      flex: 1,
      minWidth: isMediumScreen ? 160 : 140,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => {
        const statusColors: Record<string, 'warning' | 'success' | 'info' | 'default'> = {
          'ожидается доставка': 'warning',
          'получена': 'success',
          'отсортирована': 'info',
        }

        const status = row.arrival_status || 'В обработке'
        const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

        return <Chip label={capitalizeFirstLetter(status)} color={statusColors[status] ?? 'default'} />
      },
    },
    {
      field: 'products',
      headerName: 'Товаров',
      flex: 1,
      minWidth: isMediumScreen ? 120 : 80,
      align: 'left',
      headerAlign: 'left',
      valueGetter: (_value: string, row: ArrivalWithClient) => row.products.length,
    },
    {
      field: 'Actions',
      headerName: '',
      flex: 2,
      minWidth: isMediumScreen ? 220 : 160,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        return (
          <>
            <IconButton onClick={() => onEdit(row)}>
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

      <Box className="my-8">
        <Modal handleClose={handleClose} open={isOpen}>
          <ArrivalForm />
        </Modal>
      </Box>
    </Box>
  )
}

export default ArrivalsDataList

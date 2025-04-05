import { ArrivalWithClient } from '../../../types'
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import { NavLink } from 'react-router-dom'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { ruRU } from '@mui/x-data-grid/locales'
import ConfirmationModal from '../../../components/UI/Modal/ConfirmationModal.tsx'
import { useArchivedArrivalsActions } from '../hooks/useArchivedArrivalsActions.ts'
import StatusArrivalCell from '../../arrivals/components/StatusArrivalCell.tsx'

const ArchivedArrivals = () => {
  const { arrivals, handleDeleteClick, handleConfirmDelete, handleUnarchiveClick, handleConfirmUnarchive, handleClose, deleteModalOpen, unarchiveModalOpen } = useArchivedArrivalsActions()
  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

  const columns: GridColDef<ArrivalWithClient>[] = [
    {
      field: 'arrivalNumber',
      headerName: 'Номер поставки',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => (
        <NavLink to={`/arrivals/${ row._id }`} className="py-2 px-3 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-150 border border-blue-200 hover:border-blue-300 whitespace-nowrap">
          {row.arrivalNumber}
        </NavLink>
      ),
    },
    {
      field: 'client',
      headerName: 'Клиент',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
      valueGetter: (_value, row) => row.client?.name ?? 'Неизвестный клиент',
    },
    {
      field: 'stock',
      headerName: 'Склад',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
      valueGetter: (_value, row) => row.stock?.name ?? 'Неизвестный склад',
    },
    {
      field: 'arrival_date',
      headerName: 'Дата поставки',
      flex: 1,
      minWidth: isMediumScreen ? 140 : 100,
      align: 'left',
      headerAlign: 'left',
      type: 'date',
      valueGetter: (_value, row) => new Date(row.arrival_date),
      valueFormatter: row => dayjs(row).format('DD.MM.YYYY'),
    },
    {
      field: 'arrival_price',
      headerName: 'Цена доставки',
      flex: 1,
      minWidth: isMediumScreen ? 170 : 140,
      align: 'left',
      headerAlign: 'left',
      type: 'number',
    },
    {
      field: 'arrival_status',
      headerName: 'Статус',
      flex: 1,
      minWidth: isMediumScreen ? 160 : 140,
      align: 'left',
      headerAlign: 'left',
      renderCell: params => <StatusArrivalCell row={params.row} />,
    },
    {
      field: 'Actions',
      headerName: '',
      minWidth: isMediumScreen ? 80 : 80,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      editable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => handleDeleteClick(row._id)}>
            <ClearIcon />
          </IconButton>
          <IconButton onClick={() => handleUnarchiveClick(row._id)}>
            <UnarchiveIcon />
          </IconButton>
        </Box>
      ),
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
          sx={{
            '& .center-cell': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 !important',
            },
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
            },
          }}
        />
      ) : (
        <Typography className="text-center mt-5">Поставки не найдены.</Typography>
      )}

      <ConfirmationModal
        open={deleteModalOpen}
        entityName="эту поставку"
        actionType="delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleClose}
      />

      <ConfirmationModal
        open={unarchiveModalOpen}
        entityName="эту поставку"
        actionType="unarchive"
        onConfirm={handleConfirmUnarchive}
        onCancel={handleClose}
      />
    </Box>
  )
}

export default ArchivedArrivals

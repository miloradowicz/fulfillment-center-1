import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ruRU } from '@mui/x-data-grid/locales'
import dayjs from 'dayjs'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { useArchivedOrdersActions } from '../hooks/useArchivedOrdersActions'
import StatusOrderCell from '../../orders/components/StatusOrderCell'
import { NavLink } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { OrderWithClient } from '@/types'

const ArchivedOrders = () => {
  const {
    orders,
    isLoading,
    handleDeleteClick,
    handleConfirmDelete,
    handleUnarchiveClick,
    handleConfirmUnarchive,
    handleClose,
    deleteModalOpen,
    unarchiveModalOpen,
  } = useArchivedOrdersActions()

  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

  const columns: GridColDef<OrderWithClient>[] = [
    {
      field: 'orderNumber',
      headerName: 'Номер заказа',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
      renderCell: ({ row }) => (
        <NavLink
          to={`/orders/${ row._id }`}
          className="
            py-2 px-3
            bg-blue-50
            text-blue-700
            rounded-md
            text-sm
            font-medium
            hover:bg-blue-100
            transition-colors
            duration-150
            border
            border-blue-200
            hover:border-blue-300
            whitespace-nowrap
          "
          style={{
            lineHeight: '1.25rem',
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row.orderNumber || 'N/A'}
        </NavLink>
      ),
      valueGetter: (_, row) => row.orderNumber || 'N/A',
    },
    {
      field: 'client',
      headerName: 'Клиент',
      flex: 1,
      valueGetter: (_, row) => row.client?.name || 'Неизвестный клиент',
    },
    {
      field: 'stock',
      headerName: 'Склад',
      flex: 1,
      valueGetter: (_, row) => row.stock?.name ?? 'Неизвестный склад',
    },
    {
      field: 'sent_at',
      headerName: 'Отправлен',
      flex: 1,
      valueFormatter: value => value ? dayjs(value).format('DD.MM.YYYY') : 'Неизвестно',
    },
    {
      field: 'delivered_at',
      headerName: 'Доставлен',
      flex: 1,
      valueFormatter: value => (value ? dayjs(value).format('DD.MM.YYYY') : 'Не доставлен'),
    },
    {
      field: 'price',
      headerName: 'Стоимость',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 145,
      renderCell: params => <StatusOrderCell row={params.row} />,
    },
    {
      field: 'products',
      headerName: 'Товаров',
      flex: 1,
      valueGetter: (_, row) => row.products?.length || 0,
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
        <Box>
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box className="max-w-[1000px] mx-auto w-full">
      <DataGrid
        getRowId={row => row._id}
        rows={orders || []}
        columns={columns}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
          },
        }}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        entityName="этот заказ"
        actionType="delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleClose}
      />

      <ConfirmationModal
        open={unarchiveModalOpen}
        entityName="этот заказ"
        actionType="unarchive"
        onConfirm={handleConfirmUnarchive}
        onCancel={handleClose}
      />
    </Box>
  )
}

export default ArchivedOrders

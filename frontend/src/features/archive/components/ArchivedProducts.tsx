import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {
  Box,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import { ruRU } from '@mui/x-data-grid/locales'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { ProductWithPopulate } from '@/types'
import useArchivedProductActions from '../hooks/useArchivedProductsActions.ts'

const ArchivedProducts = () => {
  const {
    products,
    loading,
    confirmationOpen,
    unarchiveConfirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationDelete,
    handleUnarchiveConfirmationOpen,
    handleUnarchiveConfirmationClose,
    handleUnarchiveConfirm,
  } = useArchivedProductActions()

  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

  const columns: GridColDef<ProductWithPopulate>[] = [
    {
      field: 'title',
      headerName: 'Название',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
      valueGetter: (_value, row) => row.title ?? 'Неизвестный товар',
      sortable: true,
    },
    {
      field: 'client',
      headerName: 'Клиент',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 140,
      align: 'left',
      headerAlign: 'left',
      valueGetter: (_value, row) => row.client?.name ?? 'Неизвестный клиент',
      sortable: true,
    },
    {
      field: 'article',
      headerName: 'Артикул',
      flex: 0.7,
      minWidth: isMediumScreen ? 160 : 100,
      valueGetter: (_value, row) => row.article ?? '-',
      align: 'left',
      headerAlign: 'left',
      sortable: true,
    },
    {
      field: 'barcode',
      headerName: 'Баркод',
      flex: 0.7,
      minWidth: isMediumScreen ? 160 : 100,
      valueGetter: (_value, row) => row.barcode ?? '-',
      align: 'left',
      headerAlign: 'left',
      sortable: true,
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
          <IconButton onClick={() => handleConfirmationOpen(row._id)}>
            <ClearIcon />
          </IconButton>
          <IconButton onClick={() => handleUnarchiveConfirmationOpen(row._id)}>
            <UnarchiveIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Box className="max-w-[1100px] mx-auto w-full">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          getRowId={row => row._id}
          rows={products || []}
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
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
            },
            '& .center-cell': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 !important',
            },
          }}
        />
      )}

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этот продукт"
        actionType="delete"
        onConfirm={handleConfirmationDelete}
        onCancel={handleConfirmationClose}
      />

      <ConfirmationModal
        open={unarchiveConfirmationOpen}
        entityName="этот продукт"
        actionType="unarchive"
        onConfirm={handleUnarchiveConfirm}
        onCancel={handleUnarchiveConfirmationClose}
      />
    </Box>
  )
}

export default ArchivedProducts

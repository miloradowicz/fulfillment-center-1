import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import { ruRU } from '@mui/x-data-grid/locales'
import ConfirmationModal from '../../../components/UI/Modal/ConfirmationModal.tsx'
import useArchivedStocksActions from '../hooks/useArchivedStocksActions.ts'
import { Stock } from '../../../types'

const ArchivedStocks = () => {
  const {
    stocks,
    loading,
    confirmationOpen,
    unarchiveConfirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationDelete,
    handleUnarchiveConfirmationOpen,
    handleUnarchiveConfirmationClose,
    handleUnarchiveConfirm,
  } = useArchivedStocksActions(true)

  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

  const columns: GridColDef<Stock>[] = [
    {
      field: 'name',
      headerName: 'Название',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'address',
      headerName: 'Адрес',
      flex: 1,
      minWidth: isMediumScreen ? 200 : 160,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'Actions',
      headerName: '',
      minWidth: 80,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
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
      ) : stocks && stocks.length > 0 ? (
        <DataGrid
          getRowId={row => row._id}
          rows={stocks}
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
        <Typography className="text-center mt-5">Склады отсутствуют</Typography>
      )}

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этот склад"
        actionType="delete"
        onConfirm={handleConfirmationDelete}
        onCancel={handleConfirmationClose}
      />

      <ConfirmationModal
        open={unarchiveConfirmationOpen}
        entityName="этот склад"
        actionType="unarchive"
        onConfirm={handleUnarchiveConfirm}
        onCancel={handleUnarchiveConfirmationClose}
      />
    </Box>
  )
}

export default ArchivedStocks

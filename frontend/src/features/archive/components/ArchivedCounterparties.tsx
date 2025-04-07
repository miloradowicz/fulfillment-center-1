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
import { Counterparty } from '../../../types'
import { ruRU } from '@mui/x-data-grid/locales'
import ConfirmationModal from '../../../components/UI/Modal/ConfirmationModal.tsx'
import { useArchivedCounterpartiesActions } from '../hooks/useArchivedCounterpartiesActions.ts'

const ArchivedCounterparties = () => {
  const {
    counterparties,
    loading,
    confirmationOpen,
    unarchiveConfirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationDelete,
    handleUnarchiveConfirmationOpen,
    handleUnarchiveConfirmationClose,
    handleUnarchiveConfirm,
  } = useArchivedCounterpartiesActions(true)

  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

  const columns: GridColDef<Counterparty>[] = [
    {
      field: 'name',
      headerName: 'Название',
      flex: 1,
      minWidth: isMediumScreen ? 220 : 120,
      align: 'left',
      headerAlign: 'left',
      editable: false,
      sortable: true,
    },
    {
      field: 'phone_number',
      headerName: 'Телефон',
      flex: 1,
      minWidth: isMediumScreen ? 140 : 120,
      align: 'left',
      headerAlign: 'left',
      editable: false,
      filterable: true,
    },
    {
      field: 'address',
      headerName: 'Адрес',
      flex: 1,
      minWidth: isMediumScreen ? 220 : 160,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      editable: false,
      filterable: true,
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
      ) : counterparties && counterparties.length > 0 ? (
        <DataGrid
          getRowId={row => row._id}
          rows={counterparties}
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
        <Typography className="text-center mt-5">Контрагентов нет</Typography>
      )}

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этого контрагента"
        actionType="delete"
        onConfirm={handleConfirmationDelete}
        onCancel={handleConfirmationClose}
      />

      <ConfirmationModal
        open={unarchiveConfirmationOpen}
        entityName="этого контрагента"
        actionType="unarchive"
        onConfirm={handleUnarchiveConfirm}
        onCancel={handleUnarchiveConfirmationClose}
      />
    </Box>
  )
}

export default ArchivedCounterparties

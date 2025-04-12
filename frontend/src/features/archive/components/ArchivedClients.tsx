import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, CircularProgress, IconButton, useMediaQuery, useTheme } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { Client } from '../../../types'
import { ruRU } from '@mui/x-data-grid/locales'
import ConfirmationModal from '../../../components/UI/Modal/ConfirmationModal.tsx'
import { useArchivedClientActions } from '../hooks/useArchivedClientActions.ts'
import UnarchiveIcon from '@mui/icons-material/Unarchive'

const ArchivedClients = () => {
  const {
    clients,
    loading,
    confirmationOpen,
    unarchiveConfirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationDelete,
    handleUnarchiveConfirmationOpen,
    handleUnarchiveConfirmationClose,
    handleUnarchiveConfirm,
  } = useArchivedClientActions(true)

  const theme = useTheme()
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

  const columns: GridColDef<Client>[] = [
    {
      field: 'name',
      headerName: 'Имя',
      flex: 1,
      minWidth: isMediumScreen ? 180 : 120,
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
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: isMediumScreen ? 170 : 150,
      align: 'left',
      headerAlign: 'left',
      sortable: true,
      editable: false,
      filterable: true,
    },
    {
      field: 'inn',
      headerName: 'ИНН',
      flex: 1,
      minWidth: isMediumScreen ? 170 : 100,
      align: 'left',
      headerAlign: 'left',
      sortable: true,
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
      ) : (
        <DataGrid
          getRowId={row => row._id}
          rows={clients || []}
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
      )}

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этого клиента"
        actionType="delete"
        onConfirm={handleConfirmationDelete}
        onCancel={handleConfirmationClose}
      />

      <ConfirmationModal
        open={unarchiveConfirmationOpen}
        entityName="этого клиента"
        actionType="unarchive"
        onConfirm={handleUnarchiveConfirm}
        onCancel={handleUnarchiveConfirmationClose}
      />
    </Box>
  )
}

export default ArchivedClients

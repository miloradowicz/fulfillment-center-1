import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, IconButton, Typography, CircularProgress, useTheme, useMediaQuery } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import { Counterparty } from '@/types'
import { ruRU } from '@mui/x-data-grid/locales'
import { useCounterpartiesList } from '../hooks/useCounterpartiesList.ts'
import CounterpartyForm from './CounterpartyForm.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { useState } from 'react'

const CounterpartiesDataList = () => {
  const {
    counterparties,
    isLoading,
    confirmationModalOpen,
    handleOpenConfirmationModal,
    handleCloseConfirmationModal,
    confirmDelete,
  } = useCounterpartiesList()

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedCounterparty, setSelectedCounterparty] = useState<Counterparty | null>(null)

  const handleOpenEditModal = (counterparty: Counterparty) => {
    setSelectedCounterparty(counterparty)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedCounterparty(null)
  }

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
      minWidth: 150,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      editable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => handleOpenEditModal(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleOpenConfirmationModal(row)}>
            <ClearIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Box className="max-w-[1000px] mx-auto w-full">
      {isLoading ? (
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
      <Modal open={editModalOpen} handleClose={handleCloseEditModal}>
        {selectedCounterparty && <CounterpartyForm counterparty={selectedCounterparty} onClose={handleCloseEditModal} />}
      </Modal>

      <ConfirmationModal
        open={confirmationModalOpen}
        entityName="этого контрагента"
        actionType="delete"
        onConfirm={confirmDelete}
        onCancel={handleCloseConfirmationModal}
      />
    </Box>
  )
}

export default CounterpartiesDataList

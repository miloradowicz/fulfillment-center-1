import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, IconButton, Typography, CircularProgress, useTheme, useMediaQuery } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import { Client } from '../../../types'
import { ruRU } from '@mui/x-data-grid/locales'
import { NavLink } from 'react-router-dom'
import { useClientsList } from '../hooks/useClientsList.ts'
import { useState } from 'react'
import ClientForm from './ClientForm.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import ConfirmationModal from '../../../components/UI/Modal/ConfirmationModal.tsx'

const ClientsDataList = () => {
  const { clients, isLoading, deleteModalOpen, handleDeleteClick, handleConfirmDelete, setDeleteModalOpen } = useClientsList()

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const handleOpenEditModal = (client: Client) => {
    setSelectedClient(client)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedClient(null)
  }

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
      minWidth: isMediumScreen ? 220 : 180,
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
          <IconButton onClick={() => handleDeleteClick(row._id)}>
            <ClearIcon />
          </IconButton>
          <NavLink
            to={`/clients/${ row._id }`}
            style={{ marginLeft: '8px', whiteSpace: 'nowrap' }}
            className="text-gray-500 hover:text-gray-700"
          >
            Подробнее
          </NavLink>
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
      ) : clients && clients.length > 0 ? (
        <DataGrid
          getRowId={row => row._id}
          rows={clients}
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
        <Typography className="text-center mt-5">Клиентов нет</Typography>
      )}

      <ConfirmationModal
        open={deleteModalOpen}
        entityName="этого клиента"
        actionType="delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      <Modal open={editModalOpen} handleClose={handleCloseEditModal}>
        {selectedClient && <ClientForm client={selectedClient} onClose={handleCloseEditModal} />}
      </Modal>
    </Box>
  )
}

export default ClientsDataList

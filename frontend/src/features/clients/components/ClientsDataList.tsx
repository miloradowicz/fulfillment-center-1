import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, IconButton, Typography, CircularProgress } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import { Client } from '../../../types'
import { ruRU } from '@mui/x-data-grid/locales'
import { NavLink } from 'react-router-dom'
import { useClientsList } from '../hooks/useClientsList.ts'

const ClientsDataList = () => {
  const { clients, deleteOneClient, isLoading } = useClientsList()

  const columns: GridColDef<Client>[] = [
    {
      field: 'name',
      headerName: 'Имя',
      flex: 1,
      editable: false,
      sortable: true,
    },
    {
      field: 'phone_number',
      headerName: 'Телефон',
      flex: 1,
      editable: false,
      filterable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      sortable: true,
      editable: false,
      filterable: true,
    },
    {
      field: 'inn',
      headerName: 'ИНН',
      flex: 1,
      sortable: true,
      editable: false,
      filterable: true,
    },
    {
      field: 'address',
      headerName: 'Адрес',
      flex: 1,
      sortable: false,
      editable: false,
      filterable: true,
    },
    {
      field: 'Actions',
      headerName: '',
      type: 'number',
      width: 200,
      sortable: false,
      editable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteOneClient(row._id)}>
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
    </Box>
  )
}

export default ClientsDataList

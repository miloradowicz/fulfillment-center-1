import { OrderWithClient } from '../../../types'
import React, { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { NavLink } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import OrderForm from './OrderForm.tsx'

interface Props {
  orders: OrderWithClient[] | [];
  handleDelete: (id: string) => void
}

const OrdersList: React.FC<Props> = ({ orders, handleDelete }) => {
  const [open, setOpen] = useState(false)
  const columns: GridColDef<OrderWithClient>[] = [
    { field: '_id', headerName: 'Номер заказа', flex: 0.2 },
    { field: 'client', headerName: 'Клиент', flex: 0.2,
      valueGetter: (_value: string, row: OrderWithClient) => row.client.name },
    { field: 'price', headerName: 'Стоимость', flex: 0.1 },
    { field: 'status', headerName: 'Статус', flex: 0.1 },
    { field: 'sent_at', headerName: 'Отправлен', flex: 0.1 },
    { field: 'delivered_at', headerName: 'Доставлен', flex: 0.1 },
    {
      field: 'actions',
      headerName: '',
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton
            onClick={handleOpen}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
          >
            <ClearIcon fontSize="inherit" />
          </IconButton>
          <NavLink className="text-gray-500 hover:text-gray-700 ml-2"
            to={`/orders/${ params.row._id }`}
          >
            Подробнее
          </NavLink>
        </>
      ),
    },
  ]

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }


  return (
    <Box className="max-w-[1000px] mx-auto w-full">
      {orders ? (
        <DataGrid
          getRowId={row => row._id}
          rows={orders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 15]}
          disableRowSelectionOnClick
        />
      ) :
        (
          <Typography className="text-gray-500 text-center">
            Нет данных для отображения
          </Typography>
        )
      }
      <Modal handleClose={handleClose} open={open}><OrderForm/></Modal>
    </Box>
  )
}

export default OrdersList

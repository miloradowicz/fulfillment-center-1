import { useState } from 'react'
import { Box, Button, Card, CircularProgress, Step, StepLabel, Stepper, Tab, Tabs, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useOrderDetails } from '../hooks/useOrderDetails.ts'
import DefectsTable from '../components/DefectsTable.tsx'
import OrderLogs from '../components/OrderLogs.tsx'
import { DeleteOutline, EditOutlined } from '@mui/icons-material'
import { useAppDispatch } from '../../../app/hooks.ts'
import { deleteOrder } from '../../../store/thunks/orderThunk.ts'
import { toast } from 'react-toastify'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import OrderForm from '../components/OrderForm.tsx'
import { useNavigate } from 'react-router-dom'

enum OrderStatus {
  InAssembly = 'в сборке',
  InTransit = 'в пути',
  Delivered = 'доставлен',
}

const OrderDetails = () => {
  const { order, client, defects, loading } = useOrderDetails()
  const [tabValue, setTabValue] = useState(0)
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const statuses = Object.values(OrderStatus)
  const activeStep = order ? statuses.indexOf(order.status as OrderStatus) : 0

  const orderColumns = [
    { field: 'title', headerName: 'Наименование', flex: 1 },
    { field: 'amount', headerName: 'Количество', width: 130 },
    { field: 'barcode', headerName: 'Штрихкод', width: 180 },
    { field: 'article', headerName: 'Артикул', width: 150 },
  ]

  const handleDelete = async (id: string) => {
    try {
      if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
        await dispatch(deleteOrder(id))
        navigate('/orders')
      } else {
        toast.info('Вы отменили удаление заказа')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleOpenEdit = () => {
    setOpen(true)
  }

  if (loading) {
    return (
      <Box className="flex justify-center mt-4">
        <CircularProgress />
      </Box>
    )
  }

  if (!order) {
    return <Typography className="text-center mt-4">Заказ не найден</Typography>
  }

  return (
    <Card className="max-w-4xl mx-auto mt-6 bg-white shadow-lg rounded-lg p-6">
      <Box className="flex justify-between items-center pb-2 mb-2">
        <Typography variant="h5" className="font-semibold">
          Заказ #{order._id}
        </Typography>
        <Box className="text-right">
          <Typography variant="body2" className="text-gray-600 text-sm">
            Отправлен: <span className="font-bold">{dayjs(order.sent_at).format('DD.MM.YYYY HH:mm')}</span>
          </Typography>

          <Typography variant="body2" className="text-gray-600 text-sm">
            {order.delivered_at ? (
              <>
                Доставлен: <span className="font-bold">{dayjs(order.delivered_at).format('DD.MM.YYYY HH:mm')}</span>
              </>
            ) : (
              'Не доставлен'
            )}
          </Typography>

          <Typography variant="h6" className="text-sky-700" sx={{ fontWeight: 600, fontSize: '18px' }}>
            Стоимость: {order.price}
          </Typography>
        </Box>
      </Box>

      <Box className="flex justify-center gap-4 mt-4">
        {client && (
          <Card className="bg-gray-100 p-4 shadow-sm flex flex-col gap-1 w-100">
            <Typography variant="h6" marginBottom={2} className="text-center">
              Клиент
            </Typography>
            <Typography variant="body1">{client.name}</Typography>
            <Typography variant="body1">{client.email}</Typography>
            <Typography variant="body1">{client.phone_number}</Typography>
          </Card>
        )}
        <Card className="bg-gray-100 p-4 shadow-sm w-100">
          <Typography variant="h6" marginBottom={4} className="text-center">
            Статус заказа
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {statuses.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Card>
      </Box>

      <Box className="mt-2 bg-gray-50 p-4 rounded-lg">
        <Typography variant="h6" className="mb-3 font-semibold text-center">
          Товары:
        </Typography>
        <DataGrid
          rows={order.products.map(item => ({
            id: item._id,
            title: item.product.title,
            amount: item.amount,
            barcode: item.product.barcode,
            article: item.product.article,
          }))}
          columns={orderColumns}
          pageSizeOptions={[5, 10, 20, 100]}
          disableRowSelectionOnClick
        />
      </Box>
      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} className="mt-6">
        <Tab label="История" />
        <Tab label="Дефекты" />
      </Tabs>
      <Box className="mt-4 bg-gray-50 p-4 rounded-lg">
        {tabValue === 0 ? <OrderLogs logs={order.logs || []} /> : <DefectsTable defects={defects} />}
      </Box>
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          type={'button'}
          variant="contained"
          startIcon={<EditOutlined />}
          sx={{
            px: 3,
            borderRadius: 2,
            textTransform: 'none',
          }}
          onClick={() => handleOpenEdit()}
        >
          Редактировать
        </Button>
        <Button
          type={'button'}
          variant="contained"
          color="error"
          startIcon={<DeleteOutline />}
          sx={{
            px: 3,
            borderRadius: 2,
            textTransform: 'none',
          }}
          onClick={() => handleDelete(order._id)}
        >
          Удалить
        </Button>
        <Modal handleClose={() => setOpen(false)} open={open}>
          <OrderForm onSuccess={() => setOpen(false)} />
        </Modal>
      </Box>
    </Card>
  )
}

export default OrderDetails

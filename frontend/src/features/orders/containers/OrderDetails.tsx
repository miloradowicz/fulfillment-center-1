import {
  Box,
  Button,
  Card, Chip,
  CircularProgress,
  Container, IconButton,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useOrderDetails } from '../hooks/useOrderDetails.ts'
import DefectsTable from '../components/DefectsTable.tsx'
import OrderLogs from '../components/OrderLogs.tsx'
import { ArrowBack, DeleteOutline, EditOutlined } from '@mui/icons-material'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import OrderForm from '../components/OrderForm.tsx'
import { OrderWithProductsAndClients } from '../../../types'

const OrderStatus = ['в сборке', 'в пути', 'доставлен']

const OrderDetails = () => {
  const {
    order,
    defects,
    loading,
    tabValue,
    open,
    setTabValue,
    handleOpenEdit,
    handleDelete,
    setOpen,
    navigate,
  } = useOrderDetails()

  const statuses = Object.values(OrderStatus)
  const activeStep = order ? statuses.indexOf(order.status as string) : 0

  const orderColumns = [
    { field: 'title', headerName: 'Наименование', flex: 1 },
    { field: 'amount', headerName: 'Количество', width: 130 },
    { field: 'barcode', headerName: 'Штрихкод', width: 180 },
    { field: 'article', headerName: 'Артикул', width: 150 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'в сборке':
      return 'warning'
    case 'в пути':
      return 'info'
    case 'доставлен':
      return 'success'
    default:
      return 'default'
    }
  }

  const getStepDescription = (index: number, order: OrderWithProductsAndClients) => {
    const descriptions = [
      'Товар собирается на складе',
      'Заказ передан курьеру',
      order.delivered_at ? `Дата: ${ dayjs(order.delivered_at).format('D MMMM YYYY') }` : 'Ожидается доставка',
    ]
    return descriptions[index] || ''
  }

  const navigateBack = () => {
    navigate(-1)
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
    <Container maxWidth="md">
      <Card className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigateBack()}>
          <IconButton >
            <ArrowBack />
          </IconButton>
          <Typography variant="caption" className="!text-sm">
            Заказы
          </Typography>
        </Box>
        <Box className="flex gap-5 items-center pb-2 mt-3 ">
          <Box>
            <Typography variant="h5" className="!font-bold">
              Детали заказа #{order.orderNumber}
            </Typography>
          </Box>
          <Chip label={order.status} color={getStatusColor(order.status)}  sx={{
            borderRadius: '4px',
            height: '28px',
          }}
          variant="outlined" />
        </Box>
        <Box className="flex flex-col ml-5 mb-10">
          <Typography variant="caption" className="text-gray-600 text-sm">Отправлен: {dayjs(order.sent_at).format('D MMMM YYYY')}
          </Typography>
          {order.delivered_at &&
            <Typography variant="caption" className="text-gray-600 text-sm">
              Доставлен: {dayjs(order.delivered_at).format('D MMMM YYYY')}
            </Typography>
          }
        </Box>
        <Box>
          <Stepper  activeStep={activeStep} alternativeLabel>
            {OrderStatus.map((label, index) => (
              <Step key={index}>
                <StepLabel
                  optional={<span style={{ fontSize: '12px', color: '#888' }}>{getStepDescription(index, order)}</span>}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper >
        </Box>
        <Box className="flex justify-center gap-4 mt-4">
          <Card className="bg-gray-100 p-4 shadow-sm flex flex-col gap-1 w-100">
            <Typography variant="h6" marginBottom={2} className="text-center">
              Клиент
            </Typography>
            <Typography variant="body1">{order.client.name}</Typography>
            <Typography variant="body1">{order.client.email}</Typography>
            <Typography variant="body1">{order.client.phone_number}</Typography>
          </Card>
        </Box>

        <Box className="mt-2 bg-gray-50 p-4 rounded-lg">
          <Typography variant="h6" className="mb-3 font-semibold text-center">
            Товары:
          </Typography>
          <DataGrid
            rows={order.products.map(item => ({
              id: item.product._id,
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
    </Container>
  )
}

export default OrderDetails

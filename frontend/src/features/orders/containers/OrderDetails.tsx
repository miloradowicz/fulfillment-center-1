import {
  Box,
  Button,
  Card, Chip,
  CircularProgress,
  Container, Divider, IconButton,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useOrderDetails } from '../hooks/useOrderDetails.ts'
import DefectsTable from '../../../components/Tables/DefectsTable.tsx'
import { ArrowBack, DeleteOutline, EditOutlined } from '@mui/icons-material'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import OrderForm from '../components/OrderForm.tsx'
import { Link } from 'react-router-dom'
import { getOrderStatusColor } from '../utils/getOrderStatusColor.ts'
import ProductsTable from '../../../components/Tables/ProductsTable.tsx'
import { OrderStatus } from '../../../constants.ts'
import LogsTable from '../../../components/Tables/LogsTable.tsx'

const OrderDetails = () => {
  const {
    order,
    loading,
    tabValue,
    open,
    setTabValue,
    handleOpenEdit,
    handleDelete,
    setOpen,
    navigateBack,
    getStepDescription,
  } = useOrderDetails()

  const statuses = Object.values(OrderStatus)
  const activeStep = order ? statuses.indexOf(order.status as string) : 0

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
        <Box className="flex flex-wrap gap-5 items-start mt-3 mb-5">
          <Box>
            <Typography variant="h5" className="!font-bold">
              Детали заказа #{order.orderNumber}
            </Typography>
            <Box className="flex flex-col">
              <Typography variant="caption" className="text-gray-600 text-sm">Создан: {dayjs(order.sent_at).format('D MMMM YYYY')}
              </Typography>
              {order.delivered_at &&
                <Typography variant="caption" className="text-gray-600 text-sm">
                  Доставлен: {dayjs(order.delivered_at).format('D MMMM YYYY')}
                </Typography>
              }
            </Box>
          </Box>
          <Chip label={order.status} color={getOrderStatusColor(order.status)}  sx={{
            borderRadius: '4px',
            height: '28px',
          }}
          variant="outlined" />
          <Box className="ml-auto flex flex-col items-center !self-end !me-10">
            <Typography className="!text-xs">Заказчик</Typography>
            <Typography component={Link} to={`/clients/${ order.client._id }`} target="_blank" className="!font-bold underline underline-offset-4">{order.client.name}</Typography>
            <Typography className="!font-light">{order.client.phone_number}</Typography>
          </Box>
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

        <Divider className="!mt-10 !mb-4 !mx-40 uppercase text-l font-bold text-gray-600">Товары</Divider>

        <Box className="mt-2 rounded-lg ">
          <ProductsTable products={order.products}/>
        </Box>

        <Divider className="!mt-10 !mb-4 !mx-40 uppercase text-l font-bold text-gray-600">Дополнительно</Divider>

        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} className="mt-6">
          <Tab label="Дефекты" />
          <Tab label="История" />
        </Tabs>
        <Box className="mt-4">
          {tabValue === 0 ? <DefectsTable defects={order.defects} /> : <LogsTable logs={order.logs || []} />}
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

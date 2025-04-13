import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useOrderDetails } from '../hooks/useOrderDetails.ts'
import DefectsTable from '@/components/Tables/DefectsTable.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import OrderForm from '../components/OrderForm.tsx'
import { Link } from 'react-router-dom'
import ProductsTable from '@/components/Tables/ProductsTable.tsx'
import { OrderStatus } from '@/constants.ts'
import LogsTable from '@/components/Tables/LogsTable.tsx'
import ConfirmationModal from '@/components/Modal/ConfirmationModal.tsx'
import { getOrderStatusColor } from '@/utils/getOrderStatusColor.ts'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { basename } from 'path-browserify'
import EditButton from '@/components/Buttons/EditButton.tsx'
import BackButton from '@/components/Buttons/BackButton.tsx'
import ArchiveButton from '@/components/Buttons/ArchiveButton.tsx'

const OrderDetails = () => {
  const {
    order,
    loading,
    open,
    openArchiveModal,
    handleOpenEdit,
    handleArchive,
    setOpen,
    getStepDescription,
    setOpenArchiveModal,
    infoTab,
    setInfoTab,
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
      <Card className="mx-auto bg-white shadow-lg rounded-lg p-6 pb-10">
        <BackButton/>
        <Box className="flex flex-wrap gap-5 items-start mt-3 mb-10">
          <Box>
            <Chip label={order.status}
              color={getOrderStatusColor(order.status)}
              className="mb-5"
              sx={{
                borderRadius: '4px',
                height: '28px',
              }}
              variant="outlined" />
            <Typography variant="h5" className="!font-bold">
              Детали заказа #{order.orderNumber}
            </Typography>
            <Typography variant="h6" >{order.stock.name}</Typography>
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
          <Box className="ml-auto flex flex-col gap-2 items-center !self-end !me-10">
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
        <Box className="mt-4">
          <Tabs value={infoTab} onChange={(_, newValue) => setInfoTab(newValue)} className="mt-6">
            <Tab label="Дефекты" />
            <Tab label="История" />
            <Tab label="Документы" />
          </Tabs>
        </Box>
        <Box className="mt-4">
          {infoTab === 0 ? (
            <DefectsTable defects={order.defects} />
          ) : infoTab === 1 ? (
            <LogsTable logs={order.logs || []} />
          ) : (
            <Box  className="flex gap-3 items-center">
              {order?.documents?.length ? (
                order.documents.map((doc, index) => (
                  <Link
                    key={index}
                    to={`http://localhost:8000/uploads/documents/${ basename(doc.document) }`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-center gap-1 hover:text-blue-500"
                  >
                    <InsertDriveFileIcon fontSize="large" color="primary" />
                    <Typography variant="caption" className="!text-sm !truncate !w-40">{basename(doc.document)}</Typography>
                  </Link>
                ))
              ) : null}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
          }}
        >
          <EditButton onClick={() => handleOpenEdit()} />
          <ArchiveButton onClick={() => setOpenArchiveModal(true)} />

          <Modal handleClose={() => setOpen(false)} open={open}>
            <OrderForm onSuccess={() => setOpen(false)} />
          </Modal>
          <ConfirmationModal
            open={openArchiveModal}
            entityName="этот заказ"
            actionType="archive"
            onConfirm={() => handleArchive()}
            onCancel={() => setOpenArchiveModal(false)}
          />
        </Box>
      </Card>
    </Container>
  )
}

export default OrderDetails

import { Box, CircularProgress } from '@mui/material'
import OrdersList from '../components/OrdersList.tsx'
import Modal from '@/components/Modal/Modal.tsx'
import OrderForm from '../components/OrderForm.tsx'
import Grid from '@mui/material/Grid2'
import useOrderPage from '../hooks/useOrderPage.ts'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'

const OrderPage = () => {
  const { orders, open, handleOpen, handleClose, handleArchive, loading, handleOpenEdit } = useOrderPage()

  return (
    <>
      {loading ? (
        <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Modal handleClose={handleClose} open={open}>
            <OrderForm onSuccess={handleClose} />
          </Modal>
          <Box className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
            <CustomTitle text={'Заказы'}/>
            <CustomButton text={'Добавить заказ'} onClick={handleOpen} />
          </Box>
          <OrdersList onEdit={handleOpenEdit} orders={orders || []} handleDelete={handleArchive} />
        </>
      )}
    </>
  )
}

export default OrderPage

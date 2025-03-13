import { Box, Button, CircularProgress, Typography } from '@mui/material'
import OrdersList from '../components/OrdersList.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import OrderForm from '../components/OrderForm.tsx'
import Grid from '@mui/material/Grid2'
import useOrderPage from '../hooks/useOrderPage.ts'


const OrderPage = () => {
  const { orders, open, handleOpen, handleClose, handleDelete, loading } = useOrderPage()

  return (
    <>
      {loading ? (
        <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : null}

      <Modal handleClose={handleClose} open={open}><OrderForm/></Modal>
      <Box display={'flex'}  className="text-center mb-5 mt-7 text-[20px] flex items-center justify-center">
        <Typography className="flex-grow text-[20px]">Заказы</Typography>
        <Button
          sx={{
            color: '#32363F',
            borderColor: '#32363F',
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              borderColor: '#5a6268',
            },
          }}
          variant="outlined" onClick={handleOpen}>Добавить заказ</Button>
      </Box>
      <OrdersList
        orders={orders || []}
        handleDelete={handleDelete}
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
    </>
  )
}

export default OrderPage

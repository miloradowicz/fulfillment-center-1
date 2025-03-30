import { Box, Button, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material'
import OrdersList from '../components/OrdersList.tsx'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import OrderForm from '../components/OrderForm.tsx'
import Grid from '@mui/material/Grid2'
import useOrderPage from '../hooks/useOrderPage.ts'

const OrderPage = () => {
  const { orders, open, handleOpen, handleClose, handleDelete, loading, handleOpenEdit } = useOrderPage()

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

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
            <Typography variant={isSmallScreen ? 'h6' : 'h5'} className="flex-grow">
              Заказы
            </Typography>
            <Button
              sx={{
                color: '#32363F',
                marginLeft: 'auto',
                border: '1px solid #32363F',
                transition: 'all 0.3s ease-in-out',
                padding: isSmallScreen ? '1px 3px' : '3px 6px',
                fontSize: isSmallScreen ? '10px' : '12px',
                '&:hover': {
                  color: '#ffffff',
                  backgroundColor: '#32363F',
                  border: '1px solid #ffffff',
                },
              }}
              variant="outlined"
              onClick={handleOpen}
            >
              Добавить заказ
            </Button>
          </Box>
          <OrdersList onEdit={handleOpenEdit} orders={orders || []} handleDelete={handleDelete} />
        </>
      )}
    </>
  )
}

export default OrderPage

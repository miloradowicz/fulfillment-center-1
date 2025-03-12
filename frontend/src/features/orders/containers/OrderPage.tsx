import { Box, Button, CircularProgress, Typography } from '@mui/material'
import OrdersList from '../components/OrdersList.tsx'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import { selectAllOrdersWithClient, selectLoadingFetchOrder } from '../../../store/slices/orderSlice.ts'
import { useEffect, useState } from 'react'
import { deleteOrder, fetchOrdersWithClient } from '../../../store/thunks/orderThunk.ts'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { fetchProductsWithPopulate } from '../../../store/thunks/productThunk.ts'
import OrderForm from '../components/OrderForm.tsx'


const OrderPage = () => {
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectAllOrdersWithClient)
  const loading = useAppSelector(selectLoadingFetchOrder)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchOrdersWithClient())
  }, [dispatch])

  const handleDelete = (id: string) => {
    dispatch(deleteOrder(id))
    dispatch(fetchOrdersWithClient())
  }

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    dispatch(fetchProductsWithPopulate())
  }

  return (
    <>
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
      {loading ? (
        <CircularProgress />
      ) : (
        <OrdersList orders={orders || []} handleDelete={handleDelete}/>
      )}
    </>
  )
}

export default OrderPage

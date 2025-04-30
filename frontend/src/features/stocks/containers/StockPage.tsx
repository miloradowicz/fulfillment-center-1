import { useStockPage } from '../hooks/useStockPage.ts'
import StockCard from '../components/StockCard.tsx'
import Grid from '@mui/material/Grid2'
import { Box, CircularProgress } from '@mui/material'
import Modal from '@/components/Modal/Modal.tsx'
import StockForm from '../components/StockForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Warehouse } from 'lucide-react'
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'

const StockPage = () => {
  const { open, handleOpen, isLoading, handleClose, stocks } = useStockPage()

  return (
    <>
      {isLoading ? (
        <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : null}

      <Modal handleClose={handleClose} open={open} aria-modal="true">
        <StockForm onSuccess={handleClose} />
      </Modal>

      <Box display={'flex'} className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
        <CustomTitle text={'Склады'} icon={<Warehouse size={25} />}/>
        <ProtectedElement allowedRoles={['super-admin', 'admin']}>
          <CustomButton text={'Добавить склад'} onClick={handleOpen}/>
        </ProtectedElement>
      </Box>

      <div className="max-w-[1040px] mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-10">
        {stocks &&
          stocks.map(stock => (
            <StockCard key={stock._id} stock={stock} />
          ))}
      </div>
    </>
  )
}

export default StockPage

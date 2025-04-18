import Modal from '@/components/Modal/Modal.tsx'
import { Box, CircularProgress } from '@mui/material'
import { useArrivalPage } from '../hooks/useArrivalPage.ts'
import ArrivalsDataList from '../components/ArrivalsDataList.tsx'
import ArrivalForm from '../components/ArrivalForm.tsx'
import Grid from '@mui/material/Grid2'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Truck } from 'lucide-react'
import ProductForm from '@/features/products/components/ProductForm.tsx'

const ArrivalPage = () => {
  const {
    open,
    formType,
    handleOpen,
    handleClose,
    isLoading,
    arrivalToEdit,
    handleOpenEdit,
  } = useArrivalPage()

  return (
    <>
      {isLoading && (
        <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      )}

      <Modal handleClose={handleClose} open={open} aria-modal="true">
        {formType === 'arrival' ? (
          <ArrivalForm initialData={arrivalToEdit} onSuccess={handleClose} />
        ) : (
          <ProductForm onSuccess={handleClose} />
        )}
      </Modal>

      <Box display={'flex'} className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
        <CustomTitle text={'Поставки'} icon={<Truck size={25} />} />
        <Box display={'flex'} className="gap-3">
          <CustomButton text={'Добавить товар'} onClick={() => handleOpen('product')} />
          <CustomButton text={'Добавить поставку'} onClick={() => handleOpen('arrival')} />
        </Box>
      </Box>

      <Box className="my-8">
        <ArrivalsDataList onEdit={handleOpenEdit} />
      </Box>
    </>
  )
}

export default ArrivalPage

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
import ProtectedElement from '@/components/ProtectedElement/ProtectedElement.tsx'

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

      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        className="max-w-[1000px] mx-auto mb-5 mt-7 w-full gap-4"
      >
        <CustomTitle text="Поставки" icon={<Truck size={25} />} />
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={1}
          width={{ sm: 'auto' }}
        >
          <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
            <CustomButton text="Добавить товар" onClick={() => handleOpen('product')} />
          </ProtectedElement>
          <ProtectedElement allowedRoles={['super-admin', 'admin', 'manager']}>
            <CustomButton text="Добавить поставку" onClick={() => handleOpen('arrival')} />
          </ProtectedElement>
        </Box>
      </Box>

      <Box className="my-8">
        <ArrivalsDataList onEdit={handleOpenEdit} />
      </Box>
    </>
  )
}

export default ArrivalPage

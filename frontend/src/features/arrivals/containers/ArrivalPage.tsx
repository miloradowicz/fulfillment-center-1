import Modal from '@/components/ui/Modal/Modal.tsx'
import { Box, CircularProgress } from '@mui/material'
import { useArrivalPage } from '../hooks/useArrivalPage.ts'
import ArrivalsDataList from '../components/ArrivalsDataList.tsx'
import ArrivalForm from '../components/ArrivalForm.tsx'
import Grid from '@mui/material/Grid2'
import CustomButton from '@/components/ui/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/ui/CustomTitle/CustomTitle.tsx'

const ArrivalPage = () => {
  const {
    open,
    handleOpen,
    handleClose,
    isLoading,
    arrivalToEdit,
    handleOpenEdit,
  } = useArrivalPage()

  return (
    <>
      {isLoading ? (
        <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : null}

      <Modal handleClose={handleClose} open={open} aria-modal="true">
        <ArrivalForm initialData={arrivalToEdit} onSuccess={handleClose} />
      </Modal>

      <Box display={'flex'} className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
        <CustomTitle text={'Поставки'}/>
        <CustomButton text={'Добавить поставку'} onClick={handleOpen}/>
      </Box>
      <Box className="my-8">
        <ArrivalsDataList onEdit={handleOpenEdit} />
      </Box>
    </>
  )
}

export default ArrivalPage

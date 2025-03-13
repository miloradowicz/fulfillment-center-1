import Modal from '../../../components/UI/Modal/Modal.tsx'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useArrivalPage } from '../hooks/useArrivalPage.ts'
import ArrivalsDataList from '../components/ArrivalsDataList.tsx'
import ArrivalForm from '../components/ArrivalForm.tsx'
import Grid from '@mui/material/Grid2'

const ArrivalPage = () => {
  const { open, handleOpen, handleClose, isLoading } = useArrivalPage()

  return (
    <>
      {isLoading ? (
        <Grid sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : null}

      <Modal handleClose={handleClose} open={open}>
        <ArrivalForm />
      </Modal>
      <Box display={'flex'} className="text-center mb-5 mt-7 text-[20px] flex items-center justify-center">
        <Typography className="flex-grow text-[20px]">Поставки</Typography>
        <Button
          sx={{
            'color': '#32363F',
            'marginLeft': 'auto',
            'border': '1px solid #32363F',
            'transition': 'all 0.3s ease-in-out',
            '&:hover': {
              color: '#ffffff',
              backgroundColor: '#32363F',
              border: '1px solid #ffffff',
            },
          }}
          variant="outlined"
          onClick={handleOpen}
        >
          Добавить поставку
        </Button>
      </Box>
      <Box className="my-8">
        <ArrivalsDataList />
      </Box>
    </>
  )
}

export default ArrivalPage

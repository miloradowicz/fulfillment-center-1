import Modal from '../../../components/UI/Modal/Modal.tsx'
import { Box, Button, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useArrivalPage } from '../hooks/useArrivalPage.ts'
import ArrivalsDataList from '../components/ArrivalsDataList.tsx'
import ArrivalForm from '../components/ArrivalForm.tsx'
import Grid from '@mui/material/Grid2'

const ArrivalPage = () => {
  const {
    open,
    handleOpen,
    handleClose,
    isLoading,
    arrivalToEdit,
    handleOpenEdit,
  } = useArrivalPage()

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

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
        <Typography
          variant={isSmallScreen ? 'h6' : 'h5'}
          className="flex-grow"
        >
          Поставки
        </Typography>
        <Button
          sx={{
            'color': '#32363F',
            'marginLeft': 'auto',
            'border': '1px solid #32363F',
            'transition': 'all 0.3s ease-in-out',
            'padding': isSmallScreen ? '1px 3px' : '3px 6px',
            'fontSize': isSmallScreen ? '10px' : '12px',
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
        <ArrivalsDataList onEdit={handleOpenEdit} />
      </Box>
    </>
  )
}

export default ArrivalPage

import { useStockPage } from '../hooks/useStockPage.ts'
import StockCard from '../components/StockCard.tsx'
import Grid from '@mui/material/Grid2'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import StockForm from '../components/StockForm.tsx'

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

      <Box display={'flex'} className="text-center mb-5 mt-7 text-[20px]">
        <Typography className="flex-grow" variant={'h5'}>
          Склады
        </Typography>
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
          Добавить склад
        </Button>
      </Box>

      <div className="max-w-[1040px] mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-10">
        {stocks &&
          stocks.map(stock => (
            <StockCard key={stock._id} stock={stock} />
          ))}
      </div>
    </>
  )
}

export default StockPage

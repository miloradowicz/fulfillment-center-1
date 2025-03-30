import Modal from '../../../components/UI/Modal/Modal.tsx'
import { Box, Button, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useCounterpartyPage } from '../hooks/useCounterpartyPage.ts'
import CounterpartiesDataList from '../components/CounterpartiesDataList.tsx'
import CounterpartyForm from '../components/CounterpartyForm.tsx'

const CounterpartiesPage = () => {
  const { open, handleOpen, handleClose, isLoading } = useCounterpartyPage()

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
          <CircularProgress />
        </Box>
      )}

      <Modal handleClose={handleClose} open={open}>
        <CounterpartyForm onClose={handleClose} />
      </Modal>
      <Box className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
        <Typography variant={isSmallScreen ? 'h6' : 'h5'} className="flex-grow">
          Контрагенты
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
          Добавить контрагента
        </Button>
      </Box>
      <Box className="my-8">
        <CounterpartiesDataList />
      </Box>
    </>
  )
}

export default CounterpartiesPage

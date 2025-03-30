import { Box, Button, Typography } from '@mui/material'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import { useState } from 'react'
import ServiceForm from '../components/ServiceForm.tsx'

const ServicesPage = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Modal handleClose={handleClose} open={open}><ServiceForm onClose={handleClose}/></Modal>
      <Box display={'flex'}  className="text-center mb-5 mt-7 text-[20px] flex items-center justify-center">
        <Typography className="flex-grow text-[20px]">Услуги</Typography>
        <Button
          sx={{
            color: '#32363F',
            marginLeft: 'auto',
            border: '1px solid #32363F',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              color: '#ffffff',
              backgroundColor: '#32363F',
              border: '1px solid #ffffff',
            },
          }}
          variant="outlined"
          onClick={handleOpen} >Добавить услугу</Button>
      </Box>
    </>
  )
}

export default ServicesPage

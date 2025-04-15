import { Box } from '@mui/material'
import Modal from '@/components/Modal/Modal.tsx'
import { useState } from 'react'
import ServiceForm from '../components/ServiceForm.tsx'
import CustomButton from '@/components/CustomButton/CustomButton.tsx'
import CustomTitle from '@/components/CustomTitle/CustomTitle.tsx'
import { Handshake } from 'lucide-react'

const ServicesPage = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Modal handleClose={handleClose} open={open}><ServiceForm onClose={handleClose}/></Modal>
      <Box  display={'flex'} className="max-w-[1000px] mx-auto mb-5 mt-7 w-full flex items-center justify-end">
        <CustomTitle text={'Услуги'} icon={<Handshake size={25} />}/>
        <CustomButton text={'Добавить услугу'} onClick={handleOpen}/>
      </Box>
    </>
  )
}

export default ServicesPage

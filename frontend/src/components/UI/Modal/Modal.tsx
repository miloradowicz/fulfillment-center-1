import { Dialog, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

export interface ModalProps {
  open: boolean
  handleClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ open, handleClose, children }) => {
  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      className="text-[#32363F]"
      open={open}
      onClose={handleClose}
      disableEnforceFocus
    >
      <IconButton
        style={{ marginLeft: 'auto' }}
        onClick={handleClose}
        aria-label="Закрыть модальное окно"
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}

export default Modal

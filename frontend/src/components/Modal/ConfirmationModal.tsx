import React from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'

interface ConfirmationModalProps {
  open: boolean;
  entityName: string;
  actionType: 'delete' | 'archive' | 'unarchive';
  onConfirm: () => void;
  onCancel: () => void;
}

const actionLabels = {
  delete: {
    text: 'удалить',
    color: '#c60000',
    hoverColor: '#770000',
  },
  archive: {
    text: 'архивировать',
    color: '#1976d2',
    hoverColor: '#115293',
  },
  unarchive: {
    text: 'восстановить',
    color: '#00b608',
    hoverColor: '#1b5e20',
  },
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  entityName,
  actionType,
  onConfirm,
  onCancel,
}) => {
  const { text, color, hoverColor } = actionLabels[actionType]

  return (
    <Modal open={open} onClose={onCancel} aria-labelledby="confirmation-modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'white',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 300,
        }}
      >
        <Typography sx={{ mt: 2 }} variant="h6">
          Вы действительно хотите {text} {entityName}?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={onCancel} color="inherit">
            Отмена
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            sx={{
              backgroundColor: color,
              '&:hover': { backgroundColor: hoverColor },
              color: 'white',
              ml: 2,
            }}
          >
            {text}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ConfirmationModal

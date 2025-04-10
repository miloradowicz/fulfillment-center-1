import React from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'

interface DeleteConfirmationModalProps {
  open: boolean;
  entityName: string;
  actionType: 'delete' | 'archive';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  entityName,
  actionType,
  onConfirm,
  onCancel,
}) => {
  const actionText = actionType === 'delete' ? 'удалить' : 'архивировать'
  const actionTitle = actionType === 'delete' ? 'удалить' : 'архивировать'

  return (
    <Modal open={open} onClose={onCancel} aria-labelledby="delete-modal-title">
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
          Вы действительно хотите {actionText} {entityName}?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={onCancel} color="inherit">
            Отмена
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            sx={{
              backgroundColor: '#c60000',
              '&:hover': { backgroundColor: '#770000' },
              color: 'white',
              ml: 2,
            }}
          >
            {actionTitle}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default ConfirmationModal

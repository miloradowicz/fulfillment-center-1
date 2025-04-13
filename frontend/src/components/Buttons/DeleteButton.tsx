import React from 'react'
import { Button } from '@mui/material'
import { DeleteOutline } from '@mui/icons-material'

interface Props {
  onClick: () => void;
}

const DeleteButton: React.FC<Props> = ({ onClick }) => {
  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteOutline />}
        sx={{
          px: 3,
          borderRadius: 2,
          textTransform: 'none',
        }}
        onClick={onClick}
      >
        Удалить
      </Button>
    </>
  )
}

export default DeleteButton

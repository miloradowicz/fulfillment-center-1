import React from 'react'
import { EditOutlined } from '@mui/icons-material'
import { Button } from '@mui/material'

interface Props {
  onClick: () => void;
}

const EditButton: React.FC<Props> = ({ onClick }) => {
  return (
    <>
      <Button
        variant="contained"
        startIcon={<EditOutlined />}
        onClick={onClick}
        sx={{
          px: 3,
          borderRadius: 2,
          textTransform: 'none',
        }}
      >
        Править
      </Button>
    </>
  )
}

export default EditButton

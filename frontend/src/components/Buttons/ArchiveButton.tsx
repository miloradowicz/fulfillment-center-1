import React from 'react'
import { Button } from '@mui/material'
import ArchiveIcon from '@mui/icons-material/Archive'

interface Props {
  onClick: () => void;
}

const ArchiveButton: React.FC<Props> = ({ onClick }) => {
  return (
    <>
      <Button
        variant="contained"
        startIcon={<ArchiveIcon />}
        sx={{
          px: 3,
          borderRadius: 2,
          textTransform: 'none',
        }}
        onClick={onClick}
      >
        Архивировать
      </Button>
    </>
  )
}

export default ArchiveButton

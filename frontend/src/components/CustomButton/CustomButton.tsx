import React from 'react'
import { Button, useMediaQuery, useTheme } from '@mui/material'

interface CustomButtonProps {
  text: string;
  onClick: () => void;
}

const CustomButton:React.FC<CustomButtonProps> = ({ text, onClick }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Button
      sx={{
        color: '#32363F',
        marginLeft: 'auto',
        border: '1px solid #32363F',
        transition: 'all 0.3s ease-in-out',
        padding:  '5px 8px',
        fontSize: isSmallScreen ? '11px' : '13px',
        whiteSpace: 'nowrap',
        '&:hover': {
          color: '#ffffff',
          backgroundColor: '#32363F',
          border: '1px solid #ffffff',
        },
      }}
      variant="outlined"
      onClick={onClick}
    >
      {text}
    </Button>
  )
}

export default CustomButton

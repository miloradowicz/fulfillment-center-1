import React from 'react'
import { Typography, useMediaQuery, useTheme } from '@mui/material'

interface CustomTitleProps {
  text: string;
}

const CustomTitle: React.FC<CustomTitleProps> = ({ text }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Typography variant={isSmallScreen ? 'h6' : 'h5'} className="flex-grow">
      {text}
    </Typography>
  )
}

export default CustomTitle

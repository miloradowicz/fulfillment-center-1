import { useNavigate } from 'react-router-dom'
import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'


const BackButton = () => {
  const navigate = useNavigate()

  return (
    <Box className="cursor-pointer hover:bg-gray-100 rounded w-[100px] group" onClick={() => navigate(-1)}>
      <IconButton
        className="!flex !items-center !gap-1"
        style={{ backgroundColor: 'transparent' }}
      >
        <ArrowBackIosNewIcon className="text-gray-500 group-hover:text-gray-700" />
        <Typography className="!text-[14px] text-gray-500 !tracking-tight !font-semibold uppercase group-hover:text-gray-700">
          Назад
        </Typography>
      </IconButton>
    </Box>

  )
}

export default BackButton

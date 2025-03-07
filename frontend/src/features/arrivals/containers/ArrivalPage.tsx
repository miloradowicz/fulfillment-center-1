import { Box, Button } from '@mui/material'
import { NavLink } from 'react-router-dom'


const ArrivalPage = () => {
  return (
    <Box display={'flex'}  style={{ textAlign:'center', marginTop:'30px', fontSize:'20px', alignItems: 'center', justifyContent:'space-around' }}>
      <Box>Поставки</Box>
      <Button
        sx={{
          color: '#32363F',
          borderColor: '#32363F',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#f8f9fa',
            borderColor: '#5a6268',
          },
        }}
        variant="outlined"  component={NavLink} to={'/add-new-arrival'}>Добавить поставку</Button>
    </Box>
  )
}

export default ArrivalPage

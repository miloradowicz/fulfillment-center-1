import React from 'react'
import { Box, Card, CardActions, CardContent, Typography } from '@mui/material'
import { StockPopulate } from '../../../types'
import { NavLink } from 'react-router-dom'
import { useStockCard } from '../hooks/useStockCard.ts'
import Modal from '../../../components/UI/Modal/Modal.tsx'
import StockForm from './StockForm.tsx'

interface Props {
  stock: StockPopulate
}

const StockCard: React.FC<Props> = ({ stock }) => {
  const { isOpen, handleClose } = useStockCard()

  return (
    <Box>
      <Card className="mb-6 max-w-1/2" variant="outlined">
        <CardContent>
          <Typography variant="h4">{stock.name}</Typography>

          <Typography variant="h5" component="div">
            {stock.address}
          </Typography>
        </CardContent>

        <CardActions>
          <NavLink className="text-gray-500 hover:text-gray-700 ml-2" to={`/stocks/${ stock._id }`}>
            Подробнее
          </NavLink>
        </CardActions>
      </Card>

      <Box className="my-8">
        <Modal handleClose={handleClose} open={isOpen}>
          <StockForm />
        </Modal>
      </Box>
    </Box>
  )
}

export default StockCard

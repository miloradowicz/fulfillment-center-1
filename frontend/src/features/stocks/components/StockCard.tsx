import React from 'react'
import { Typography } from '@mui/material'
import { StockPopulate } from '@/types'
import { NavLink } from 'react-router-dom'
import { useStockCard } from '../hooks/useStockCard.ts'
import Modal from '@/components/ui/Modal/Modal.tsx'
import StockForm from './StockForm.tsx'

interface Props {
  stock: StockPopulate
}

const StockCard: React.FC<Props> = ({ stock }) => {
  const { isOpen, handleClose } = useStockCard()

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md flex flex-col">
      <div className="mb-8">
        <Typography variant="h5" className="whitespace-normal break-words">
          {stock.name}
        </Typography>

        <Typography variant="h6" component="div" className="whitespace-normal break-words">
          {stock.address}
        </Typography>
      </div>

      <div className="mt-auto">
        <NavLink
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:border-gray-700"
          to={`/stocks/${ stock._id }`}
        >
          Подробнее
        </NavLink>
      </div>

      <div>
        <Modal handleClose={handleClose} open={isOpen}>
          <StockForm />
        </Modal>
      </div>
    </div>
  )
}

export default StockCard

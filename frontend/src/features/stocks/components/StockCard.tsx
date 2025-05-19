import React from 'react'
import { StockPopulate } from '@/types'
import { NavLink } from 'react-router-dom'
import { useStockCard } from '../hooks/useStockCard.ts'
import Modal from '@/components/Modal/Modal.tsx'
import StockForm from './StockForm.tsx'
import { Button } from '@/components/ui/button.tsx'

interface Props {
  stock: StockPopulate
}

const StockCard: React.FC<Props> = ({ stock }) => {
  const { isOpen, handleClose } = useStockCard()

  return (
    <div className="p-6 bg-muted rounded-lg shadow-sm flex flex-col">
      <div className="mb-8">
        <h5 className="whitespace-normal break-words font-bold sm:text-lg text-md">{stock.name}</h5>
        <h6 className="whitespace-normal break-words sm:text-lg text-md">{stock.address}</h6>
      </div>

      <div className="mt-auto">
        <Button>
          <NavLink className="text-white font-bold" to={`/stocks/${ stock._id }`}>
            Подробнее
          </NavLink>
        </Button>
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

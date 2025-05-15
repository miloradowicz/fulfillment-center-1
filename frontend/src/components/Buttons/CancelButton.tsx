import React from 'react'
import { Button } from '@/components/ui/button'
import { SquareX } from 'lucide-react'

interface Props {
  onClick: () => void
}

const CancelButton: React.FC<Props> = ({ onClick }) => {
  return (
    <div>
      <Button
        onClick={onClick}
        className="font-bold text-xs bg-red-400 hover:bg-red-500 text-white transition-colors mb-2"
      >
        <SquareX size={18} /> Отменить
      </Button>
    </div>
  )
}

export default CancelButton

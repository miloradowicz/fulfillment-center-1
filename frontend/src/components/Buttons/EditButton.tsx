import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

interface Props {
  onClick: () => void
}

const EditButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className="font-bold text-xs bg-muted hover:bg-primary text-primary hover:text-white transition-colors"
    >
      <Edit size={17} />
      Править
    </Button>
  )
}

export default EditButton

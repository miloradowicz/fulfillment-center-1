import React from 'react'
import { Button } from '@/components/ui/button'
import { ArchiveRestore } from 'lucide-react'

interface Props {
  onClick: () => void
}

const ArchiveButton: React.FC<Props> = ({ onClick }) => {
  return (
    <>
      <Button
        onClick={onClick}
        className="shadow-sm font-bold sm:text-sm bg-muted hover:bg-primary text-primary hover:text-white transition-colors"
      >
        <ArchiveRestore size={18} /> Архивировать
      </Button>
    </>
  )
}

export default ArchiveButton

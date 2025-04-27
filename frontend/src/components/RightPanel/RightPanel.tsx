import React, { ReactNode } from 'react'
import { Sheet, SheetClose, SheetContent } from '../ui/sheet'
import { Button } from '../ui/button'

interface RightPanelProps {
  children: ReactNode
  open: boolean
  onOpenChange: (value: boolean) => void
}

const RightPanel: React.FC<RightPanelProps> = ({
  children,
  open,
  onOpenChange,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={'w-full sm:max-w-[400px]  p-4'}>
        <SheetClose asChild className={'absolute left-1/2 -translate-x-1/2 bottom-6'} onClick={ () => onOpenChange(false)}>
          <Button variant="default">Закрыть</Button>
        </SheetClose>
        {children}
      </SheetContent>
    </Sheet>
  )
}

export default RightPanel

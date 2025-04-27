import React, { ReactNode } from 'react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface RightPanelProps {
  children: ReactNode
  open: boolean
  onOpenChange: (value: boolean) => void
  onClose?: () => void
}

const RightPanel: React.FC<RightPanelProps> = ({
  children,
  open,
  onOpenChange,
  onClose,
}) => {

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value)
    if (!value && onClose) {
      onClose()
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={'w-full h-full sm:max-w-[400px] p-4'}>
        <VisuallyHidden>
          <SheetTitle>Детальный просмотр</SheetTitle>
        </VisuallyHidden>
        <SheetDescription className="sr-only">
          Детальный просмотр для разных сущностей
        </SheetDescription>
        <SheetClose asChild className={'absolute left-1/2 -translate-x-1/2 bottom-6'} onClick={ () => handleOpenChange(false)}>
          <Button variant="default">Закрыть</Button>
        </SheetClose>
        {children}
      </SheetContent>
    </Sheet>
  )
}

export default RightPanel

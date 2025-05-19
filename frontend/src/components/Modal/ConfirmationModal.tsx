import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils.ts'
import React from 'react'

interface ConfirmationModalProps {
  open: boolean
  entityName: string
  actionType: 'delete' | 'archive' | 'unarchive' | 'cancel'
  onConfirm: () => void
  onCancel: () => void
}

const actionLabels = {
  delete: { text: 'удалить', color: 'bg-red-200 text-red-800 hover:bg-red-300' },
  archive: { text: 'архивировать', color: 'bg-blue-200 text-blue-800 hover:bg-blue-300' },
  unarchive: { text: 'восстановить', color: 'bg-green-200 text-green-800 hover:bg-green-300' },
  cancel: { text: 'отменить', color: 'bg-green-200 text-green-800 hover:bg-green-300' },
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  entityName,
  actionType,
  onConfirm,
  onCancel,
}) => {
  const { text, color } = actionLabels[actionType]

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="leading-snug">
            Вы действительно хотите {text} {entityName}?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button className={cn(color, 'capitalize')} onClick={onConfirm}>
            {text}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal

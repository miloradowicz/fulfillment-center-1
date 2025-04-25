import React from 'react'
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export interface ModalProps {
  open: boolean
  handleClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ open, handleClose, children }) => {
  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && handleClose()}>
      <DialogContent
        className="sm:max-w-[500px] text-primary p-6 max-h-[90vh] overflow-y-auto"
      >
        <DialogTitle/>
        <DialogClose asChild>
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
            aria-label="Закрыть модальное окно"
            onClick={handleClose}
          >
          </button>
        </DialogClose>

        <DialogDescription className="sr-only">
          Форма создания или редактирования.
        </DialogDescription>

        <div className="flex justify-center w-full mb-2 overflow-x-hidden">
          <div className="w-full sm:max-w-full">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Modal

import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx'
import { Button } from '@/components/ui/button.tsx'
import { copyToClipboard } from '@/utils/copyToClipboard.ts'
import { cn } from '@/lib/utils'

interface Props {
  text: string | null | undefined
  children?: React.ReactNode
  className?: string
}

const CopyText: React.FC<Props> = ({ text, children, className }) => {
  const [tooltipText, setTooltipText] = useState<string>('Скопировать')
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const handleCopy = async () => {
    if (!text) return

    try {
      await copyToClipboard(text)
      setTooltipText('Скопировано!')
      setTooltipOpen(true)

      setTimeout(() => {
        setTooltipOpen(false)
      }, 2000)
    } catch (err) {
      console.error('Ошибка копирования:', err)
      setTooltipText('Ошибка')
      setTooltipOpen(true)
    }
  }

  const handleMouseEnter = () => {
    setTooltipText('Скопировать')
  }

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild onMouseEnter={handleMouseEnter}>
          <Button
            className={cn(
              'group p-0 text-primary hover:text-blue-500 bg-0 hover:bg-transparent border-none shadow-none flex items-center gap-2',
              className,
            )}
            onClick={handleCopy}
          >
            {children && <span className="group-hover:text-blue-500 transition-colors duration-200">{children}</span>}
            {text}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CopyText

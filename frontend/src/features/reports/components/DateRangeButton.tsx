import { Button } from '@/components/ui/button.tsx'

interface UniversalButtonProps {
  text: string
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

const ButtonDateRangePicker = ({
  text,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
}: UniversalButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      className={`w-full sm:w-44 text-center px-2 sm:px-4 py-2 bg-[#3679a1] hover:bg-[#2f6586] text-sm shadow-sm transition-all duration-300 hover:shadow-md active:scale-95 active:shadow-lg ${ className }`}
    >
      {text}
    </Button>
  )
}

export default ButtonDateRangePicker

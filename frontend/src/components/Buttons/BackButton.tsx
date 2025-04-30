import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.tsx'
import { ChevronLeft } from 'lucide-react'

interface BackButtonProps {
  to?: string
}

const BackButton: React.FC<BackButtonProps> = ({ to }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const pathWithoutId = location.pathname.split('/').slice(0, -1).join('/')

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(pathWithoutId)
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className="flex items-center gap-1 text-primary hover:bg-muted hover:shadow-sm rounded-lg uppercase text-sm font-semibold tracking-tight mt-5"
    >
      <ChevronLeft className="h-6 w-6" />
      Назад
    </Button>
  )
}

export default BackButton

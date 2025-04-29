import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.tsx'
import { ChevronLeft } from 'lucide-react'

const BackButton = () => {
  const navigate = useNavigate()

  return (
    <Button
      onClick={() => navigate(-1)}
      variant="ghost"
      className="flex items-center gap-1 text-primary hover:bg-muted hover:shadow-sm rounded-lg uppercase text-sm font-semibold tracking-tight mt-5"
    >
      <ChevronLeft className="h-6 w-6" />
      Назад
    </Button>
  )
}

export default BackButton

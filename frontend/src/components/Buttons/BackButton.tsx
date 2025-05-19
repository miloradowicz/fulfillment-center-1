import { Button } from '@/components/ui/button.tsx'
import { ArrowLeft } from 'lucide-react'

const BackButton = () => {

  return (
    <Button
      onClick={() => window.history.back()}
      variant="ghost"
      className="flex items-center gap-1 text-primary hover:bg-muted hover:shadow-sm rounded-lg uppercase text-sm font-semibold tracking-tight mt-5"
    >
      <ArrowLeft className="h-6 w-6" />
      Назад
    </Button>
  )
}

export default BackButton

import { LoaderCircle } from 'lucide-react'

const Loader = () => {
  return (
    <div className="flex justify-center text-center my-5">
      <LoaderCircle className="animate-spin h-9 w-9 text-primary/85" />
    </div>
  )
}

export default Loader

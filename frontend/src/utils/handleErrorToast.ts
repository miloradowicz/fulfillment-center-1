import { toast } from 'react-toastify'

export const handleErrorToast = (error: unknown) => {
  if (typeof error === 'string') {
    toast.error(error)
  } else if (error instanceof Error) {
    toast.error(error.message)
  } else if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    toast.error((error as { message: string }).message)
  } else {
    toast.error('Неизвестная ошибка')
  }
}

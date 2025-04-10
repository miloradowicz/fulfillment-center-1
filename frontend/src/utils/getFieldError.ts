import { ValidationError } from '@/types'

export const getFieldError = (fieldName: string, createError:ValidationError | null) => {
  try {
    return createError?.errors[fieldName].messages.join('; ')
  } catch {
    return undefined
  }
}


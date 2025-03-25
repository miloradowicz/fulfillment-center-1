import { ValidationError } from '../types'

export const isValidationError = (obj: unknown): obj is ValidationError =>
  typeof obj === 'object' && obj !== null &&
  'type' in obj && typeof obj.type === 'string' && obj.type === 'ValidationError' &&
  'errors' in obj && typeof obj.errors === 'object' && obj.errors !== null && Object.values(obj.errors).every(
    (x: unknown) =>
      typeof x ==='object' && x !== null &&
      'name' in x && typeof x.name === 'string' &&
      'messages' in x && Array.isArray(x.messages) && x.messages.every(
        (y: unknown) => typeof y ==='string',
      ),
  )

export const hasMessage = (obj: unknown): obj is { message: string } =>
  typeof obj === 'object' && obj !== null &&
  'message' in obj && typeof obj.message === 'string'

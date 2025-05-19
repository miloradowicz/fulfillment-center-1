import { ProductField, ServiceField } from '@/types'

export const normalizeField = <T extends Partial<ProductField & ServiceField>>(items?: T[]): T[] =>
  items?.map(item => ({
    ...item,
    ...(item.product !== undefined && {
      product: typeof item.product === 'string' ? item.product : item.product._id,
    }),
    ...(item.service !== undefined && {
      service: typeof item.service === 'string' ? item.service : item.service._id,
    }),
  })) || []

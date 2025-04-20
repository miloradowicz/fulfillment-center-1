import { ArrivalMutation, OrderMutation } from '@/types'

export const createArrivalAndOrderFormData = (data: ArrivalMutation | OrderMutation, files?: File[]) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        Object.entries(item).forEach(([fieldName, fieldValue]) => {
          if (fieldValue === undefined || fieldValue === null) return
          const formattedKey = `${ key }[${ index }][${ fieldName }]`
          formData.append(formattedKey, fieldValue.toString())
        })
      })
    } else if (typeof value === 'object' && 'toISOString' in value) {
      formData.append(key, (value as Date).toISOString())
    } else {
      formData.append(key, value.toString())
    }
  })

  files?.forEach(file => {
    formData.append('documents', file)
  })

  return formData
}

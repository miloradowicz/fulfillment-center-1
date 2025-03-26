import { ArrivalMutation } from '../types'

export const createArrivalFormData = (data: ArrivalMutation, file?: File) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        Object.entries(item).forEach(([fieldName, fieldValue]) => {
          const formattedKey = `${ key }[${ index }][${ fieldName }]`
          formData.append(formattedKey, fieldValue.toString())
        })
      })
    }
    else if (typeof value === 'object' && 'toISOString' in value) {
      formData.append(key, (value as Date).toISOString())
    }
    else {
      formData.append(key, value.toString())
    }
  })

  if (file) {
    formData.append('documents', file)
  }

  return formData
}

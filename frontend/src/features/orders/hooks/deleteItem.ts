import React from 'react'
import { OrderMutation } from '@/types'

export const deleteItem = <T,>(
  index: number,
  setList: React.Dispatch<React.SetStateAction<T[]>>,
  setForm: React.Dispatch<React.SetStateAction<OrderMutation>>,
  fieldName: keyof OrderMutation,
) => {
  setList(prev => prev.filter((_item, i) => i !== index))

  setForm(prev => ({
    ...prev,
    [fieldName]: Array.isArray(prev[fieldName])
      ? (prev[fieldName] as T[]).filter((_item, i) => i !== index)
      : [],
  }))
}

import React from 'react'

export const deleteItem = <T,>(
  index: number,
  setList: React.Dispatch<React.SetStateAction<T[]>>,
  setForm: React.Dispatch<React.SetStateAction<any>>,
  fieldName: string,
) => {
  setList(prev => prev.filter((_item, i) => i !== index))
  setForm((prev:any) => ({
    ...prev,
    [fieldName]: prev[fieldName] ? prev[fieldName].filter((_item: T, i: number) => i !== index) : [],
  }))
}

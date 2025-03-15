import React from 'react'

export const deleteItem = <T,>(
  index: number,
  setList: React.Dispatch<React.SetStateAction<T[]>>,
  // TODO fix any https://botsmannatashaa.atlassian.net/browse/JE2-96
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: React.Dispatch<React.SetStateAction<any>>,
  fieldName: string,
) => {
  setList(prev => prev.filter((_item, i) => i !== index))
  // TODO fix any https://botsmannatashaa.atlassian.net/browse/JE2-96
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm((prev:any) => ({
    ...prev,
    [fieldName]: prev[fieldName] ? prev[fieldName].filter((_item: T, i: number) => i !== index) : [],
  }))
}

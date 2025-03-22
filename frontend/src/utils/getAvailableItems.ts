import { Dispatch, SetStateAction } from 'react'

export const getAvailableItems = <T extends { _id: string }>(
  allItems: T[],
  sentItems: { product: Pick<T, keyof T> }[],
  availableItems: T[],
  setAvailableItems: Dispatch<SetStateAction<T[]>>,
  idField: keyof T = '_id',
) => {
  if (allItems) {
    const newItems = allItems
      .filter(item => sentItems.some(sentItem => sentItem.product[idField] === item[idField]))
      .filter(item => !availableItems.some(availableItem => availableItem[idField] === item[idField]))

    if (newItems.length > 0) {
      setAvailableItems(prev => [...prev, ...newItems])
    }
  }
}

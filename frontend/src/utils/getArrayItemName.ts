export const getArrayItemNameById = <T extends { _id: string; title?: string; name?: string }>(
  items: T[] | null | undefined,
  itemId: string,
  isService: boolean = false,
): string => {
  if (!items) return isService ? 'Неизвестная услуга' : 'Неизвестный товар'

  const item = items.find(i => i._id === itemId)

  if (item) {
    return isService ? (item.name || 'Неизвестная услуга') : (item.title || 'Неизвестный товар')
  }

  return isService ? 'Неизвестная услуга' : 'Неизвестный товар'
}

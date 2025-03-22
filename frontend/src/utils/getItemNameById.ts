export function getItemNameById<T>(
  items: T[] | null,
  labelKey: keyof T,
  idKey: keyof T,
): { label: T[keyof T]; id: T[keyof T] }[] {
  return items ? items.map(item => ({
    label: item[labelKey],
    id: item[idKey],
  })) : []
}

export function getAutocompleteItemName<T extends object>(
  items: T[] | null,
  labelKey: keyof T,
  idKey: keyof T,
): { label: string; id: string }[] {
  return items?.map(item => ({
    label: String(item[labelKey]),
    id: String(item[idKey]),
  })) || []
}

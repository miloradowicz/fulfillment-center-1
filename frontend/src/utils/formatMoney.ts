export const formatMoney = (value?: number): string => {
  if (typeof value !== 'number') return '—'
  return value.toFixed(2)
}

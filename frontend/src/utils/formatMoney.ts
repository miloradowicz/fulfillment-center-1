export const formatMoney = (value?: number): string => {
  if (typeof value !== 'number') return '—'
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

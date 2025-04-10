export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'не указано'
  const [year, month, day] = dateStr.split('-')
  return `${ day }.${ month }.${ year }`
}

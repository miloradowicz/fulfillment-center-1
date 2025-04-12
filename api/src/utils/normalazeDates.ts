export const normalizeDates = (start: Date, end: Date): [Date, Date] => {
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  return [start, end]
}

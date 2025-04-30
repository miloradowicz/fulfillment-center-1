export const getUsersInitials = (name: string) => {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() || ''
  }
  const initials = parts[0][0] + parts[1][0]
  return initials.toUpperCase()
}

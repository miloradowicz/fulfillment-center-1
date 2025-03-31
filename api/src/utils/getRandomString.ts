export const getRandomStr = (length = 5): string => {
  const randStr: string = Date.now().toString(36) + Math.random().toString(36).slice(2)
  return randStr.slice(0, length)
}

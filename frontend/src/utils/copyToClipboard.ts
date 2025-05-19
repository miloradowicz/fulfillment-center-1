export const copyToClipboard = async (text: string | null | undefined) => {
  if (!text) return null

  try {
    await navigator.clipboard.writeText(text)
    return text
  } catch (_err) {
    const textArea = document.createElement('textarea')
    textArea.value = text

    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '-9999px'

    document.body.appendChild(textArea)
    textArea.select()

    try {
      document.execCommand('copy')
    } finally {
      document.body.removeChild(textArea)
    }
    return text
  }
}

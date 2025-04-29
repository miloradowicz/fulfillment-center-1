export const copyToClipboard = (text: string | null | undefined) => {
  if (text) {
    const tempInput = document.createElement('input')
    document.body.appendChild(tempInput)
    tempInput.value = text
    tempInput.select()
    tempInput.setSelectionRange(0, 99999)
    document.execCommand('copy')
    document.body.removeChild(tempInput)
    return text
  }
  return null
}

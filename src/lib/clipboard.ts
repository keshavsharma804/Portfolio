export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // fall through to the legacy path below
  }

  try {
    const area = document.createElement('textarea')
    area.value = value
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.top = '0'
    area.style.opacity = '0'
    area.style.pointerEvents = 'none'
    document.body.appendChild(area)
    area.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(area)
    return copied
  } catch {
    return false
  }
}

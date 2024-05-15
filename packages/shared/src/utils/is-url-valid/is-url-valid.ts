export const is_url_valid = (text: string) => {
  if (!text.startsWith('http')) return false
  try {
    new URL(text)
    return true
  } catch (err) {
    return false
  }
}

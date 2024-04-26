export const is_url_valid = (text: string) => {
  try {
    new URL(text)
    return true
  } catch (err) {
    return false
  }
}

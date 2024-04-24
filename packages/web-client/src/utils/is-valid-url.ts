export const is_valid_url = (text: string) => {
  try {
    new URL(text)
    return true
  } catch (err) {
    return false
  }
}

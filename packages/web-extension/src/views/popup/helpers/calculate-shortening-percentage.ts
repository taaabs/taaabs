export const calculate_shortening_percentage = (
  full_text?: string,
  shortened_text?: string,
): number | undefined => {
  if (!full_text || !shortened_text) {
    return
  }

  const full_length = full_text.length
  const shortened_length = shortened_text.length

  const difference = full_length - shortened_length
  const percentage = (difference / full_length) * 100

  return Math.floor(percentage)
}

export const validate_date_newer_than_epoch = (datetime: string) => {
  const epoch = new Date(0) // Represents the epoch

  try {
    const parsed_date = new Date(datetime)
    return parsed_date > epoch
  } catch (error) {
    return false
  }
}

export const subtract_minutes = (date: Date, minutes: number): Date => {
  const millis = minutes * 60_000
  const new_date_in_milliseconds = date.getTime() - millis
  return new Date(new_date_in_milliseconds)
}

export const subtract_hours = (date: Date, hours: number): Date => {
  return new Date(date.getTime() - hours * 60 * 60 * 1000)
}

export const subtract_days = (date: Date, days: number): Date => {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000)
}

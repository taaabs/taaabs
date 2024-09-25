export const subtract_hours = (date: Date, hours: number): Date => {
  return new Date(date.getTime() - hours * 60 * 60 * 1000)
}

export const subtract_days = (date: Date, days: number): Date => {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000)
}

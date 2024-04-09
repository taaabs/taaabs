export const url_to_wayback = (params: { date: Date; url: string }): string => {
  const year = params.date.getFullYear()
  const month = (params.date.getMonth() + 1).toString().padStart(2, '0')
  const day = params.date.getDate().toString().padStart(2, '0')
  const hours = params.date.getHours().toString().padStart(2, '0')
  const minutes = params.date.getMinutes().toString().padStart(2, '0')
  const seconds = params.date.getSeconds().toString().padStart(2, '0')

  return `https://web.archive.org/web/${year}${month}${day}${hours}${minutes}${seconds}/${params.url}`
}

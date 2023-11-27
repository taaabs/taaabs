export const get_domain_from_url = (url: string): string => {
  const parsedUrl = url.replace(/(https?:\/\/)?/i, '')

  if (parsedUrl.indexOf('/') != -1) {
    return parsedUrl.split('/')[0]
  }

  return parsedUrl
}

export const url_path_for_display = (params: {
  url: string
  site_path?: string
}): string => {
  let parsed_url = params.url.replace('://', '')

  // Remove trailing slash if present.
  if (parsed_url.endsWith('/')) {
    parsed_url = parsed_url.substring(0, parsed_url.length - 1)
  }

  // Strip common URL endings.
  const remove_ending_from_url = (url: string) => {
    switch (true) {
      case url.endsWith('/index.html'):
        return url.substring(0, url.length - 11)
      case url.endsWith('/index.htm'):
        return url.substring(0, url.length - 10)
      case url.endsWith('.html'):
        return url.substring(0, url.length - 5)
      case url.endsWith('.htm'):
        return url.substring(0, url.length - 4)
    }
    return url
  }

  parsed_url = remove_ending_from_url(parsed_url)

  const parsed_url_arr = parsed_url.split('/')
  parsed_url_arr.shift()

  parsed_url = parsed_url_arr.join('/')

  if (params.site_path && parsed_url.startsWith(params.site_path)) {
    parsed_url = parsed_url.substring(params.site_path.length + 1)
  }

  return parsed_url
    .split('/')
    .map((segment) => segment.replace(/(.{5})/g, '$1​'))
    .join(' › ')
}

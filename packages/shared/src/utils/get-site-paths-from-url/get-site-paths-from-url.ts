const regex = /^https?:\/\/[^\/]+\/?([^?#]*)/

export const get_site_paths_from_url = (url: string): string[] => {
  const site_paths: Set<string> = new Set()
  const path = url.match(regex)?.[1]
  if (path) {
    const segments = path.split('/')
    for (let i = 0; i < segments.length; i++) {
      site_paths.add(
        segments
          .slice(0, i + 1)
          .filter(Boolean)
          .join('/')
          .substring(0, 20), // There is something off with the website if a site path is unreasonably long
      )
    }
  } else {
    return []
  }
  return [...site_paths].slice(0, site_paths.size - 1)
}

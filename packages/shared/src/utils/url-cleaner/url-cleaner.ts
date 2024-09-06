export const url_cleaner = (url: string): string => {
  try {
    const parsed_url = new URL(url)
    const search_params = new URLSearchParams(parsed_url.search)

    // Remove common tracking parameters
    const tracking_params = [
      'ref',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'gclid',
      'dclid',
    ]
    tracking_params.forEach((param) => search_params.delete(param))

    // Reconstruct the URL without the tracking parameters
    parsed_url.search = search_params.toString()

    // Special handling for YouTube URLs
    if (
      parsed_url.hostname == 'www.youtube.com' &&
      parsed_url.pathname == '/watch'
    ) {
      const video_id = search_params.get('v')
      if (video_id) {
        return `https://www.youtube.com/watch?v=${video_id}`
      }
    }

    return parsed_url.toString()
  } catch (error) {
    // If the URL is invalid, return the original URL
    return url
  }
}

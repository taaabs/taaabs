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

    // Remove the fragment (hash) from the URL
    parsed_url.hash = ''

    // Special handling for YouTube URLs
    if (
      parsed_url.hostname == 'www.youtube.com' ||
      parsed_url.hostname == 'm.youtube.com'
    ) {
      parsed_url.hostname = 'www.youtube.com' // Normalize to www.youtube.com

      if (parsed_url.pathname == '/watch') {
        const video_id = search_params.get('v')
        if (video_id) {
          return `https://www.youtube.com/watch?v=${video_id}`
        }
      } // Removed the else if block handling /shorts/ URLs
    } else if (
      parsed_url.hostname == 'twitter.com' ||
      parsed_url.hostname == 'x.com'
    ) {
      // Clear all parameters for Twitter/X URLs
      parsed_url.search = ''
      // Standardize to x.com
      parsed_url.hostname = 'x.com'
      // Remove any trailing slash if present, except for root domain
      if (parsed_url.pathname.endsWith('/') && parsed_url.pathname.length > 1) {
        parsed_url.pathname = parsed_url.pathname.slice(0, -1)
      }
    }

    return parsed_url.toString()
  } catch (error) {
    // If the URL is invalid, return the original URL
    return url
  }
}

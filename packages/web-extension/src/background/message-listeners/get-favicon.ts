import { is_message } from '@/utils/is-message'
import browser from 'webextension-polyfill'

export const get_favicon = () => {
  browser.runtime.onMessage.addListener(async (request): Promise<any> => {
    if (is_message(request) && request.action == 'get-favicon') {
      const domain = request.domain
      try {
        const favicon = await download_favicon(domain) // Returns blob, that needs to be converted to image in a content script
        return { favicon }
      } catch (error) {
        console.error(`Error downloading favicon for ${domain}:`, error)
        return false
      }
    }
  })
}

const get_favicon_url = (html: string) => {
  const regex =
    /<link[^>]*rel=["'](icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/gi
  const matches = [...html.matchAll(regex)]
  const favicon_rels = ['icon', 'shortcut icon', 'apple-touch-icon']

  for (let rel of favicon_rels) {
    for (let match of matches) {
      if (match[1] == rel) {
        return match[2]
      }
    }
  }

  return '/favicon.ico'
}

const download_favicon = async (domain: string) => {
  try {
    const response = await fetch(`https://${domain}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML from ${domain}`)
    }
    const html = await response.text()
    let favicon_url = get_favicon_url(html)

    // Ensure the favicon URL is absolute
    if (!favicon_url.startsWith('http')) {
      favicon_url = new URL(favicon_url, `https://${domain}`).href
    }

    const favicon_response = await fetch(favicon_url)
    if (!favicon_response.ok) {
      throw new Error(`Failed to fetch favicon from ${favicon_url}`)
    }

    const array_buffer = await favicon_response.arrayBuffer()
    const blob = new Blob([array_buffer])

    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error(`Error fetching favicon:`, error)
    return null
  }
}
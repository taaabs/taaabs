import { is_message } from '@/utils/is-message'
import browser from 'webextension-polyfill'

export const get_cover = () => {
  browser.runtime.onMessage.addListener((request, _, send_response): any => {
    if (is_message(request) && request.action == 'get-cover') {
      const url = request.url
      download_cover(url).then((cover) => {
        send_response({ cover })
      })
      return true
    }
    return false
  })
}

const get_cover_url = async (html: string, url: string) => {
  const parsed_url = new URL(url)

  // Prioritize YouTube Thumbnails
  if (
    parsed_url.hostname == 'www.youtube.com' ||
    parsed_url.hostname == 'm.youtube.com'
  ) {
    const video_id =
      parsed_url.searchParams.get('v') || parsed_url.pathname.split('/')[1]
    if (video_id) {
      const thumbnail_urls = [
        `https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`,
        `https://i.ytimg.com/vi/${video_id}/sddefault.jpg`,
        `https://i.ytimg.com/vi/${video_id}/hqdefault.jpg`,
        `https://i.ytimg.com/vi/${video_id}/mqdefault.jpg`,
        `https://i.ytimg.com/vi/${video_id}/default.jpg`,
      ]

      for (const thumbnail_url of thumbnail_urls) {
        try {
          const response = await fetch(thumbnail_url, { method: 'HEAD' })
          if (response.ok) {
            return thumbnail_url
          }
        } catch (error) {
          // Ignore errors and try the next URL
        }
      }
    }
  }

  // Fallback to og:image
  const regex =
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/gi
  const match = regex.exec(html)
  if (match) {
    return match[1]
  }

  return null
}

const download_cover = async (url: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML from ${url}`)
    }
    const html = await response.text()
    let cover_url = await get_cover_url(html, url)

    if (!cover_url) return null

    // Ensure the cover URL is absolute
    if (!cover_url.startsWith('http')) {
      cover_url = new URL(cover_url, url).href
    }

    const cover_response = await fetch(cover_url)
    if (!cover_response.ok) {
      throw new Error(`Failed to fetch cover from ${cover_url}`)
    }

    const array_buffer = await cover_response.arrayBuffer()
    const blob = new Blob([array_buffer])

    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {}
}

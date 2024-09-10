import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import { get_cover_with_blurhash } from '@shared/utils/get-cover-with-blurhash/get-cover-with-blurhash'
import { HtmlParser } from '@shared/utils/html-parser'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { send_message } from '../helpers/send-message'
import { useEffect, useState } from 'react'

export type TabData = {
  url: string
  html: string
  title?: string
  description?: string
  og_image?: string
  favicon?: string
}

export const use_create_bookmark = () => {
  const [is_creating, set_is_creating] = useState<boolean>()

  const create_bookmark = async () => {
    set_is_creating(true)
    const before_bookmark_parsed = Date.now()

    const url = new URL(window.location.href)

    let is_youtube = false
    // Check if the URL is a YouTube video URL
    if (url.hostname == 'www.youtube.com') {
      is_youtube = true
    }

    const get_og_image_url = async () => {
      if (is_youtube) {
        const video_id = url.searchParams.get('v')
        if (video_id) {
          const image_urls = [
            `https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`,
            `https://i.ytimg.com/vi/${video_id}/hqdefault.jpg`,
            `https://i.ytimg.com/vi/${video_id}/mqdefault.jpg`,
            `https://i.ytimg.com/vi/${video_id}/default.jpg`,
          ]

          for (const image_url of image_urls) {
            try {
              const response = await fetch(image_url, { method: 'HEAD' })
              if (response.ok) {
                return image_url
              }
            } catch (error) {
              // Ignore errors and try the next URL
            }
          }
        }
      }

      const meta_tags = document.getElementsByTagName('meta')
      for (let i = 0; i < meta_tags.length; i++) {
        if (meta_tags[i].getAttribute('property') == 'og:image') {
          return meta_tags[i].getAttribute('content')
        }
      }

      return undefined
    }

    const get_favicon_url = () => {
      // Check for 32x32 favicon
      const favicon_32x32 = document.querySelector(
        'link[rel="icon"][sizes="32x32"]',
      )
      if (favicon_32x32) {
        return favicon_32x32.getAttribute('href')
      }

      // Check for shortcut icon with type image/x-icon
      const favicon = document.querySelector(
        `document.querySelector('link[href$=".ico"]')`,
      )
      if (favicon) {
        return favicon.getAttribute('href')
      }

      // If no specific favicon found, use the default favicon.ico
      return new URL(window.location.href).origin + '/favicon.ico'
    }

    const get_base64_of_image_url = async (
      image_url: any,
      width?: any,
      height?: any,
    ) => {
      const img = document.createElement('img')
      img.src = image_url
      img.setAttribute('crossorigin', 'anonymous')
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => reject(new Error('Image not found'))
      })
      const canvas = document.createElement('canvas')
      canvas.width = width || img.width
      canvas.height = height || img.height
      const ctx = canvas.getContext('2d')!
      if (width && height) {
        ctx.drawImage(img, 0, 0, width, height)
      } else {
        ctx.drawImage(img, 0, 0)
      }
      return canvas.toDataURL('image/webp')
    }

    const og_image_url = await get_og_image_url()
    let og_image = undefined
    if (og_image_url) {
      try {
        og_image = await get_base64_of_image_url(og_image_url)
      } catch {}
    }

    let favicon = undefined
    try {
      favicon = await get_base64_of_image_url(get_favicon_url(), 32, 32)
    } catch {}

    const get_description = () => {
      let description: string | undefined | null = undefined
      if (is_youtube) {
        const description_text = document.querySelector(
          'span.yt-core-attributed-string--link-inherit-color:nth-of-type(1)',
        )?.textContent
        const sentence_endings = ['.', '?', '!', '...']
        const ends_with_sentence_ending = sentence_endings.some((ending) =>
          description_text?.endsWith(ending),
        )
        description = ends_with_sentence_ending
          ? description_text
          : `${description_text}...`
      } else {
        description = document.querySelector(
          "meta[name='description']",
        )?.textContent
      }

      return description || undefined
    }
    const description = get_description()

    const get_title = () => {
      let title = document.title
      if (is_youtube) {
        title = title.replace(/^\(\d+\)\s*/, '').replace(/ - YouTube$/, '')
      }
      return title
    }
    const title = get_title()

    let html = ''

    // TODO: Send over youtube transcript with timestamps
    // Telegram
    if (url.href.match(/^https:\/\/t\.me\/[^\/]+\/[^\/]+$/)) {
      const embed_url = `${url}?embed=1&mode=tme`
      const response = await fetch(embed_url)
      html = await response.text()
    } else {
      html = document.getElementsByTagName('html')[0].outerHTML
    }

    const reader_data = (await HtmlParser.parse({
      url: url.href,
      html,
    }))?.reader_data

    const favicon_base64 = favicon ? favicon.split(',')[1] : undefined

    let cover: string | undefined = undefined
    let blurhash: string | undefined = undefined

    if (og_image) {
      const cover_with_blurhash = await get_cover_with_blurhash(og_image)
      cover = cover_with_blurhash.cover.split(',')[1]
      blurhash = cover_with_blurhash.blurhash
    }

    const bookmark: UpsertBookmark_Params = {
      is_public: false,
      is_archived: false,
      title,
      note: description,
      tags: [],
      links: [
        {
          url: url_cleaner(url.href),
          favicon: favicon_base64,
          reader_data,
        },
      ],
      cover,
      blurhash,
    }

    console.log(`Page parsed in ${Date.now() - before_bookmark_parsed}ms.`)
    send_message({ action: 'create-bookmark', bookmark })
  }

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'created-bookmark') {
        console.log('Received newly created bookmark:', event.data)
      }
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  return { create_bookmark, is_creating, set_is_creating }
}

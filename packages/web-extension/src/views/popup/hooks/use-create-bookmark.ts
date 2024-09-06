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

    const process_tab_data_and_send = async (tab_data: TabData) => {
      const reader_data = HtmlParser.parse({
        url: tab_data.url,
        html: tab_data.html,
      })?.reader_data

      const favicon = tab_data?.favicon
        ? tab_data.favicon.split(',')[1]
        : undefined

      let cover: string | undefined = undefined
      let blurhash: string | undefined = undefined

      if (tab_data?.og_image) {
        const cover_with_blurhash = await get_cover_with_blurhash(
          tab_data.og_image,
        )
        cover = cover_with_blurhash.cover.split(',')[1]
        blurhash = cover_with_blurhash.blurhash
      }

      const url = url_cleaner(tab_data.url)

      const bookmark: UpsertBookmark_Params = {
        is_public: false,
        is_archived: false,
        title: tab_data.title, // We'll clean the title here
        note: tab_data.description,
        tags: [],
        links: [
          {
            url,
            favicon,
            reader_data,
          },
        ],
        cover,
        blurhash,
      }

      console.log(
        `Bookmark parsed in ${Date.now() - before_bookmark_parsed}ms}.`,
      )
      send_message({ action: 'create-bookmark', bookmark })
    }

    const document_data = async (): Promise<{
      html: string
      title: string
      description?: string
      favicon?: string
      og_image?: string
    }> => {
      const url = new URL(window.location.href)

      let is_youtube = false
      // Check if the URL is a YouTube video URL
      if (url.hostname === 'www.youtube.com') {
        is_youtube = true
      }

      const get_og_image_url = () => {
        if (is_youtube) {
          const video_id = url.searchParams.get('v')
          if (video_id) {
            return `https://i.ytimg.com/vi/${video_id}/maxresdefault.jpg`
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

      const og_image_url = get_og_image_url()
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
          description = description_text?.endsWith('.')
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

      const html = document.getElementsByTagName('html')[0].outerHTML

      return { og_image, favicon, description, title, html }
    }

    const { html, favicon, og_image, description, title } =
      await document_data()

    const tab_data: TabData = {
      url: document.location.href,
      title,
      html,
      description,
      favicon,
      og_image,
    }
    process_tab_data_and_send(tab_data)
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

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
        title: tab_data.title,
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

    const doc_data = async (
      doc: any,
    ): Promise<{
      html: string
      favicon?: string
      og_image?: string
    }> => {
      const get_og_image_url = () => {
        const meta_tags = doc.getElementsByTagName('meta')
        for (let i = 0; i < meta_tags.length; i++) {
          if (meta_tags[i].getAttribute('property') == 'og:image') {
            return meta_tags[i].getAttribute('content')
          }
        }
      }

      const get_favicon_url = () => {
        const link_tags = doc.getElementsByTagName('link')
        const favicon_rels = ['icon', 'shortcut icon', 'apple-touch-icon']
        for (let i = 0; i < link_tags.length; i++) {
          if (favicon_rels.includes(link_tags[i].getAttribute('rel'))) {
            return link_tags[i].getAttribute('href')
          }
        }
        return new URL(window.location.href).origin + '/favicon.ico'
      }

      const get_base64_of_image_url = async (
        url: any,
        width?: any,
        height?: any,
      ) => {
        const img = doc.createElement('img')
        img.src = url
        img.setAttribute('crossorigin', 'anonymous')
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = () => reject(new Error('Image not found'))
        })
        const canvas = doc.createElement('canvas')
        canvas.width = width || img.width
        canvas.height = height || img.height
        const ctx = canvas.getContext('2d')
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

      const html = doc.getElementsByTagName('html')[0].outerHTML

      return { og_image, favicon, html }
    }

    const check_iframe_support = async () => {
      const title = document.title
      const og_title_element = document.querySelector(
        'meta[property="og:title"]',
      )
      if (!og_title_element) return false
      const og_title_content = og_title_element.getAttribute('content')
      if (title.toLowerCase().includes(og_title_content!.toLowerCase()))
        return false

      try {
        const response = await fetch(window.location.href)
        const headers = response.headers

        const x_frame_options = headers.get('X-Frame-Options')
        if (x_frame_options) {
          if (x_frame_options === 'DENY') {
            return false
          }
        }

        const csp = headers.get('Content-Security-Policy')
        if (csp && csp.includes('frame-ancestors')) {
          const frame_ancestors = csp.match(/frame-ancestors\s+([^;]+)/)
          if (frame_ancestors) {
            const sources = frame_ancestors[1].split(' ')
            if (!sources.includes('*') && !sources.includes('self')) {
              return false
            }
          }
        }

        return true
      } catch (error) {
        console.error('Error checking iframe support:', error)
        return false
      }
    }

    check_iframe_support().then(async (supports_iframe) => {
      if (supports_iframe) {
        const iframe = document.createElement('iframe')
        iframe.src = location.href
        iframe.style.visibility = 'hidden'
        document.body.appendChild(iframe)
        iframe.addEventListener('load', async () => {
          const doc = iframe.contentWindow!.document
          const { html, favicon, og_image } = await doc_data(doc)
          const url = document.location.href
          const title = doc.title
          const description =
            doc.querySelector("meta[name='description']") != null
              ? (doc.querySelector("meta[name='description']") as any).content
              : ''
          const tab_data: TabData = {
            url,
            html,
            title,
            description,
            favicon,
            og_image,
          }
          process_tab_data_and_send(tab_data)
          document.body.removeChild(iframe)
        })
      } else {
        const url = document.location.href
        const title = document.title
        const description =
          document.querySelector("meta[name='description']") != null
            ? (document.querySelector("meta[name='description']") as any)
                .content
            : ''
        const { html, favicon, og_image } = await doc_data(document)
        const tab_data: TabData = {
          url,
          html,
          title,
          description,
          favicon,
          og_image,
        }
        process_tab_data_and_send(tab_data)
      }
    })
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

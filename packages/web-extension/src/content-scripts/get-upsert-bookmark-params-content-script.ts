import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'
import { UpsertBookmarkParams_Message } from '@/types/messages'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { get_cover_with_blurhash } from '@shared/utils/get-cover-with-blurhash/get-cover-with-blurhash'

browser.runtime.onMessage.addListener((message: any, _, __): any => {
  if (is_message(message) && message.action == 'get-upsert-bookmark-params') {
    ;(async () => {
      try {
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

        const get_favicon_url = (): string => {
          // Check for 32x32 favicon
          const favicon_32x32 = document.querySelector(
            'link[rel="icon"][sizes="32x32"]',
          )
          if (favicon_32x32) {
            const href = favicon_32x32.getAttribute('href')
            if (href) {
              return href
            }
          }

          // Look for .ico
          const favicon = document.querySelector('link[href$=".ico"]')
          if (favicon) {
            const href = favicon.getAttribute('href')
            if (href) {
              return href
            }
          }

          // If no specific favicon found, use the default favicon.ico
          return new URL(window.location.href).origin + '/favicon.ico'
        }

        const get_base64_of_image_url = async (
          image_url: string,
          max_width: number,
          max_height: number,
        ): Promise<string> => {
          const img = document.createElement('img')
          img.src = image_url
          img.setAttribute('crossorigin', 'anonymous')
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = () => reject(new Error('Image not found'))
          })

          let width = img.width
          let height = img.height

          const width_ratio = max_width / width
          const height_ratio = max_height / height
          const ratio = Math.min(width_ratio, height_ratio)

          width *= ratio
          height *= ratio

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)

          return canvas.toDataURL('image/webp')
        }

        const og_image_url = await get_og_image_url()
        let og_image = undefined
        if (og_image_url) {
          try {
            og_image = await get_base64_of_image_url(og_image_url, 1200, 630)
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
              reader_data: message.reader_data,
            },
          ],
          cover,
          blurhash,
        }

        console.debug(bookmark)

        const create_bookmark_message: UpsertBookmarkParams_Message = {
          action: 'upsert-bookmark-params',
          bookmark,
        }
        browser.runtime.sendMessage(create_bookmark_message)
      } catch (e: any) {
        console.error(e.message)
        alert('There was an issue while saving this page.')
      }
    })()
  }
  return false
})

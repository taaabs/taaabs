import { UpsertBookmark_Params } from '@repositories/modules/bookmarks/domain/types/upsert-bookmark.params'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'
import { UpsertBookmarkParams_Message } from '@/types/messages'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'

browser.runtime.onMessage.addListener((message: any, _, __): any => {
  if (is_message(message) && message.action == 'get-upsert-bookmark-params') {
    ;(async () => {
      try {
        const url = new URL(window.location.href)

        let is_youtube = false
        // Check if the URL is a YouTube video URL
        if (
          url.hostname == 'www.youtube.com' ||
          url.hostname == 'm.youtube.com'
        ) {
          is_youtube = true
        }

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

        const bookmark: UpsertBookmark_Params = {
          is_public: false,
          is_archived: false,
          title,
          note: description,
          tags: [],
          links: [
            {
              url: url_cleaner(url.href),
              reader_data: message.reader_data,
            },
          ],
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

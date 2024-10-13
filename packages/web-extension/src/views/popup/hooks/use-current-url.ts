import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

export const use_current_url = () => {
  const [url, set_url] = useState<string>('')
  const [is_new_tab_page, set_is_new_tab_page] = useState(false)
  const [is_youtube_video, set_is_youtube_video] = useState(false)

  useEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([current_tab]) => {
        const url = current_tab.url!
        const cleaned_url = url_cleaner(url)
        set_url(cleaned_url)
        set_is_new_tab_page(
          url.startsWith('chrome://') ||
            url.startsWith('moz-extension://') ||
            url == 'about:newtab',
        )
        set_is_youtube_video(
          cleaned_url.startsWith('https://www.youtube.com/watch') ||
            cleaned_url.startsWith('https://m.youtube.com/watch'),
        )
      })
  }, [])

  return { url, is_new_tab_page, is_youtube_video }
}

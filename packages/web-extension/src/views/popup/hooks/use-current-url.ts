import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

export const use_current_url = () => {
  const [is_new_tab_page, set_is_new_tab_page] = useState<boolean>()
  const [url, set_url] = useState<string>('')

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
      })
  }, [])

  return { url, is_new_tab_page }
}

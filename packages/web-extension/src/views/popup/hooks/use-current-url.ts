import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

export const use_current_url = () => {
  const [url, set_url] = useState<string>('')

  useEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([current_tab]) => {
        const cleaned_url = url_cleaner(current_tab.url!)
        set_url(cleaned_url)
      })
  }, [])

  return { url }
}

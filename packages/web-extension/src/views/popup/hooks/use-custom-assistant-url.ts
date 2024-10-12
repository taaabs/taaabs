import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

export const use_custom_assistant_url = () => {
  const [custom_assistant_url, set_custom_assistant_url] = useState<string>()

  useEffect(() => {
    browser.storage.local.get('custom_assistant_url').then((data: any) => {
      set_custom_assistant_url(data.custom_assistant_url)
    })
  }, [])

  return {
    custom_assistant_url,
  }
}

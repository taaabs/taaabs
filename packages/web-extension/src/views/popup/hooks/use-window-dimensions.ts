import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'
import { GetWindowDimensions_Message } from '@/types/messages'

export const use_window_dimensions = () => {
  const [dimensions, set_dimensions] = useState<{
    width: number
    height: number
  }>()

  useEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([current_tab]) => {
        const message: GetWindowDimensions_Message = {
          action: 'get-window-dimensions',
        }
        browser.tabs.sendMessage(current_tab.id!, message)
      })

    browser.runtime.onMessage.addListener((message: any, _, __): any => {
      if (is_message(message) && message.action == 'window-dimensions') {
        set_dimensions({
          width: message.width,
          height: message.height,
        })
      }
    })
  }, [])

  return { dimensions }
}

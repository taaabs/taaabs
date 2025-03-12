import { GetSelectedText_Message } from '@/types/messages'
import { is_message } from '@/utils/is-message'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

export const use_text_selection = () => {
  const [selected_text, set_selected_text] = useState<string>()

  useEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([current_tab]) => {
        const message: GetSelectedText_Message = {
          action: 'get-selected-text',
        }
        browser.tabs.sendMessage(current_tab.id!, message).catch(() => {
          // Silence error on a new tab
        })
      })

    browser.runtime.onMessage.addListener((message: any, _, __): any => {
      if (is_message(message) && message.action == 'selected-text') {
        set_selected_text(message.selected_text)
      }
    })
  }, [])

  return {
    selected_text,
  }
}

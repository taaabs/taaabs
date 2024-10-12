import { useEffect, useState } from 'react'
import { HtmlParser } from '@shared/utils/html-parser'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'
import { GetParsedHtml_Message } from '@/types/messages'

export const use_parsed_html = () => {
  const [parsed_html, set_parsed_html] =
    useState<HtmlParser.ParsedResult | null>()

  useEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([current_tab]) => {
        const message: GetParsedHtml_Message = {
          action: 'get-parsed-html',
        }
        browser.tabs.sendMessage(current_tab.id!, message)
      })

    browser.runtime.onMessage.addListener((message: any, _, __): any => {
      if (is_message(message) && message.action == 'parsed-html') {
        set_parsed_html(message.parsed_html)
      }
    })
  }, [])

  return { parsed_html }
}

import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'
import { GetParsedHtml_Message } from '@/types/messages'
import { HtmlParser } from '@shared/utils/html-parser'

export const use_current_tab = () => {
  const [url, set_url] = useState<string>('')
  const [title, set_title] = useState<string>('')
  const [is_new_tab_page, set_is_new_tab_page] = useState(false)
  const [is_youtube_video, set_is_youtube_video] = useState(false)
  const [parsed_html, set_parsed_html] =
    useState<HtmlParser.ParsedResult | null>()

  useEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([current_tab]) => {
        const url = current_tab.url!
        const title = current_tab.title!
        const cleaned_url = url_cleaner(url)
        set_url(cleaned_url)
        set_title(title)
        set_is_new_tab_page(
          url.startsWith('chrome://') ||
            url.startsWith('moz-extension://') ||
            url == 'about:newtab',
        )
        set_is_youtube_video(
          cleaned_url.startsWith('https://www.youtube.com/watch') ||
            cleaned_url.startsWith('https://m.youtube.com/watch'),
        )

        const get_parsed_html_message: GetParsedHtml_Message = {
          action: 'get-parsed-html',
        }
        browser.tabs.sendMessage(current_tab.id!, get_parsed_html_message)
      })

    // Set up message listener for parsed HTML
    const message_listener = (message: any, _: any, __: any): any => {
      if (is_message(message) && message.action == 'parsed-html') {
        set_parsed_html(message.parsed_html)
      }
    }
    browser.runtime.onMessage.addListener(message_listener)
    return () => browser.runtime.onMessage.removeListener(message_listener)
  }, [])

  const get_parsed_html = () => {
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
  }

  return {
    url,
    title,
    is_new_tab_page,
    is_youtube_video,
    parsed_html,
    get_parsed_html,
  }
}

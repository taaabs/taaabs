import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'
import { GetParsedHtml_Message } from '@/types/messages'
import { HtmlParser } from '@shared/utils/html-parser'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export const use_current_tab = () => {
  const [url, set_url] = useState<string>('')
  const [title, set_title] = useState<string>('')
  const [is_new_tab_page, set_is_new_tab_page] = useState(false)
  const [parsed_html, set_parsed_html] =
    useState<HtmlParser.ParsedResult | null>(null)
  const [include_in_prompt, set_include_in_prompt] = useState<boolean>(true)
  const [current_tab, set_current_tab] = useState<browser.Tabs.Tab | null>(null)

  // Load include_in_prompt setting from storage
  useEffect(() => {
    browser.storage.local
      .get('include_current_tab_in_prompt')
      .then(({ include_current_tab_in_prompt }) => {
        if (include_current_tab_in_prompt !== undefined) {
          set_include_in_prompt(include_current_tab_in_prompt as boolean)
        }
      })
  }, [])

  // Get current tab information
  useEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([tab]) => {
        if (tab) {
          set_current_tab(tab)
        }
      })
  }, [])

  // Update URL, title, and other states when current_tab changes
  useEffect(() => {
    if (!current_tab?.url) return
    const url = current_tab.url
    const title = current_tab.title || ''
    const cleaned_url = url_cleaner(url)

    set_url(cleaned_url)
    set_title(title)
    set_is_new_tab_page(
      url.startsWith('chrome://') ||
        url.startsWith('moz-extension://') ||
        url == 'about:newtab',
    )
  }, [current_tab])

  // Set up parsed HTML message listener
  useEffect(() => {
    const message_listener = (message: any, _: any, __: any): any => {
      if (is_message(message) && message.action == 'parsed-html') {
        set_parsed_html(message.parsed_html)
      }
    }

    browser.runtime.onMessage.addListener(message_listener)
    return () => browser.runtime.onMessage.removeListener(message_listener)
  }, [])

  // Persist include_in_prompt setting
  useUpdateEffect(() => {
    browser.storage.local.set({
      include_current_tab_in_prompt: include_in_prompt,
    })
  }, [include_in_prompt])

  const get_parsed_html = () => {
    const message: GetParsedHtml_Message = {
      action: 'get-parsed-html',
    }
    browser.tabs.sendMessage(current_tab!.id!, message).catch(() => {
      // Silence error on a new tab
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
    parsed_html,
    get_parsed_html,
    include_in_prompt,
    set_include_in_prompt,
  }
}

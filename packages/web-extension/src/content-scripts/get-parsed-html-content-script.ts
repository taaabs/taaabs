import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'
import { HtmlParser } from '@shared/utils/html-parser'
import { ParsedHtml_Message } from '@/types/messages'

browser.runtime.onMessage.addListener((message: any, _, __): any => {
  if (is_message(message) && message.action == 'get-parsed-html') {
    ;(async () => {
      const result = await HtmlParser.parse({
        html: document.documentElement.outerHTML,
        url: document.location.href,
      })
      const message: ParsedHtml_Message = {
        action: 'parsed-html',
        parsed_html: result || null,
      }
      browser.runtime.sendMessage(message)
    })()
  }
  return false
})

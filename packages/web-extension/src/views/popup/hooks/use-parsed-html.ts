import { useEffect, useState } from 'react'
import { send_message } from '../helpers/send-message'
import { HtmlParser } from '@shared/utils/html-parser'

export const use_parsed_html = () => {
  const [parsed_html, set_parsed_html] =
    useState<HtmlParser.ParsedResult | null>()

  useEffect(() => {
    let getting_parsed_html_started_at_timestamp: number

    // 150ms is popup entry animation duration
    setTimeout(() => {
      console.debug('Getting plain text of the current page for Assistant...')
      getting_parsed_html_started_at_timestamp = Date.now()

      const html = document.getElementsByTagName('html')[0].outerHTML
      send_message({ action: 'parse-html', html })
    }, 150)

    const listener = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'parsed-html') {
        set_parsed_html(event.data.parsed_html || null)
        console.debug(
          `Plain text for Assistant processed in ${
            Date.now() - getting_parsed_html_started_at_timestamp
          }ms.`,
        )
      }
    }
    window.addEventListener('message', listener)

    return () => {
      window.removeEventListener('message', listener)
    }
  }, [])

  return { parsed_html }
}

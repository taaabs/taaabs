import TurndownService from 'turndown'
import { Chat, ContentType } from './content'

export namespace HtmlParser {
  export type Params = {
    url: string
    html: string
  }
  export const to_plain_text = (params: Params): string | undefined => {
    const temp_el = document.createElement('div')
    temp_el.innerHTML = _cleanup_html(params.html)

    let plain_text: string | undefined = undefined
    if (temp_el.querySelector('article')) {
      plain_text = temp_el.querySelector('article')!.innerText
    } else if (temp_el.querySelector('main')) {
      plain_text = temp_el.querySelector('main')!.innerText
    }
    return plain_text?.replace(/[ \t\r\n]+/gm, ' ').trim()
  }

  export const to_content = (params: Params): string | undefined => {
    const turndown_service = new TurndownService()
    const temp_el = document.createElement('div')
    temp_el.innerHTML = _cleanup_html(params.html)

    /**
     * ChatGPT
     */
    if (params.url.startsWith('https://chatgpt.com/')) {
      const message_divs = temp_el.querySelectorAll<HTMLElement>(
        '[data-message-author-role="assistant"], div[data-message-author-role="user"]',
      )
      const messages: Chat['conversation'] = []
      message_divs.forEach((div) => {
        const author_role = div.getAttribute('data-message-author-role') as
          | 'user'
          | 'assistant'
        if (author_role == 'user') {
          messages.push({ author: 'user', text: div.textContent?.trim() || '' })
        } else if (author_role == 'assistant') {
          messages.push({
            author: 'assistant',
            markdown: turndown_service.turndown(div.innerHTML),
          })
        }
      })
      if (messages.length) {
        return JSON.stringify({
          type: ContentType.CHAT,
          conversation: messages,
        })
      }
    } else {
      let article: HTMLElement | undefined = undefined
      if (temp_el.querySelector('article')) {
        article = temp_el.querySelector('article') || undefined
      } else if (temp_el.querySelector('main')) {
        article = temp_el.querySelector('main') || undefined
      }
      if (article) {
        const markdown = turndown_service.turndown(article)
        return JSON.stringify({
          type: ContentType.GENERIC_ARTICLE,
          markdown,
        })
      }
    }
  }
}

const _cleanup_html = (html: string) => {
  return html
    .replace(/<button\b[^>]*>(.*?)<\/button>/gi, '')
    .replace(/<div[^>]*\brole\s*=\s*"button"[^>]*>(.*?)<\/div>/gi, '')
    .replace(/<script\b[^>]*>(.*?)<\/script>/gi, '')
    .replace(/<script\b[^>]*>/gi, '')
    .replace(/<style\b[^>]*>(.*?)<\/style>/gi, '')
    .replace(/<input\b[^>]*>/gi, '')
    .replace(/<textarea\b[^>]*>(.*?)<\/textarea>/gi, '')
}

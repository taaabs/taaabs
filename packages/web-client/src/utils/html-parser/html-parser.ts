import TurndownService from 'turndown'
import { ReaderData } from './reader-data'
import { Readability, isProbablyReaderable } from '@mozilla/readability'

export namespace HtmlParser {
  export type Params = {
    url: string
    html: string
  }
  export type ParsedResult = {
    plain_text: string
    reader_data: string
  }

  export const parse = (params: Params): ParsedResult | undefined => {
    const turndown_service = new TurndownService()

    const titleRegex = /<title>(.*?)<\/title>/
    const match = params.html.match(titleRegex)
    let title: string = ''
    if (match) {
      title = match[1]
    }

    /**
     * ChatGPT
     */
    if (params.url.startsWith('https://chatgpt.com/')) {
      const temp_el = document.createElement('div')
      temp_el.innerHTML = params.html
      const message_divs = temp_el.querySelectorAll<HTMLElement>(
        '[data-message-author-role="assistant"], div[data-message-author-role="user"]',
      )
      const messages: ReaderData.Chat['conversation'] = []
      message_divs.forEach((div) => {
        const author_role = div.getAttribute('data-message-author-role') as
          | 'user'
          | 'assistant'
        if (author_role == 'user') {
          messages.push({ author: 'user', text: div.textContent?.trim() || '' })
        } else if (author_role == 'assistant') {
          const parser = new DOMParser()
          const doc = parser.parseFromString(div.innerHTML, 'text/html')
          const article = new Readability(doc).parse()!
          messages.push({
            author: 'assistant',
            content: turndown_service.turndown(article.content),
          })
        }
      })
      if (messages.length) {
        return {
          plain_text: `${title ? `${title} ` : ''}${messages
            .map((message) =>
              message.author == 'user' ? message.text : message.content,
            )
            .join(' ')
            .replace(/[ \t\r\n]+/gm, ' ')
            .trim()}`,
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          } as ReaderData.Chat),
        }
      }
    } else {
      const parser = new DOMParser()
      const doc = parser.parseFromString(params.html, 'text/html')
      if (!isProbablyReaderable(doc)) return
      const links = doc.querySelectorAll('a')
      const url = new URL(params.url)
      links.forEach((link) => {
        const href = link.getAttribute('href')
        if (href && href.startsWith('/')) {
          link.setAttribute('href', url.origin + href)
        }
      })
      const article = new Readability(doc).parse()!
      return {
        plain_text: `${article.title ? `${article.title} ` : ''}${
          article.siteName ? `${article.siteName} ` : ''
        }${article.byline ? `${article.byline} ` : ''}${
          article.publishedTime ? `${article.publishedTime} ` : ''
        }${article.textContent.replace(/[ \t\r\n]+/gm, ' ').trim()}`,
        reader_data: JSON.stringify({
          type: ReaderData.ContentType.ARTICLE,
          title: article.title,
          site_name: article.siteName,
          published_at: article.publishedTime,
          author: article.byline,
          length: article.length,
          content: turndown_service.turndown(article.content),
        } as ReaderData.Article),
      }
    }
  }
}

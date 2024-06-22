import TurndownService from '@joplin/turndown'
import * as turndownPluginGfm from '@joplin/turndown-plugin-gfm'
import { ReaderData } from './reader-data'
import { Readability, isProbablyReaderable } from '@mozilla/readability'

export namespace HtmlParser {
  export type Params = {
    url: string
    html: string
  }
  export type ParsedResult = {
    reader_data: string
  }

  export const parse = (params: Params): ParsedResult | undefined => {
    const turndown_service = new TurndownService({ codeBlockStyle: 'fenced' })
    turndown_service.use(turndownPluginGfm.gfm)
    turndown_service.addRule('fencedCodeBlock', {
      filter: (node: any, options: any) => {
        return (
          options.codeBlockStyle == 'fenced' &&
          node.nodeName == 'PRE' &&
          node.querySelector('code')
        )
      },
      replacement: (_: any, node: any, options: any) => {
        const language = (node
          .querySelector('code')
          .className.match(/language-(\S+)/) || [null, ''])[1]

        return (
          '\n\n' +
          options.fence +
          language +
          '\n' +
          node.textContent +
          '\n' +
          options.fence +
          '\n\n'
        )
      },
    })
    turndown_service.addRule('stripImages', {
      filter: ['figure', 'picture', 'img'],
      replacement: () => '',
    })

    // const titleRegex = /<title>(.*?)<\/title>/
    // const match = params.html.match(titleRegex)
    // let title: string = ''
    // if (match) {
    //   title = match[1]
    // }

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
          const article = new Readability(doc, { keepClasses: true }).parse()!
          messages.push({
            author: 'assistant',
            content: turndown_service.turndown(article.content),
          })
        }
      })
      if (messages.length) {
        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          } as ReaderData.Chat),
        }
      }
    } else if (params.url.startsWith('https://gemini.google.com/app/')) {
      const temp_el = document.createElement('div')
      temp_el.innerHTML = params.html
      const user_selector = '.query-content'
      const assistant_selector = '.response-content'
      const message_divs = temp_el.querySelectorAll<HTMLElement>(
        `${user_selector}, ${assistant_selector}`,
      )
      const messages: ReaderData.Chat['conversation'] = []
      message_divs.forEach((el) => {
        if (el.matches(user_selector)) {
          messages.push({ author: 'user', text: el.textContent?.trim() || '' })
        } else if (el.matches(assistant_selector)) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(el.innerHTML, 'text/html')
          const article = new Readability(doc, { keepClasses: true }).parse()!
          messages.push({
            author: 'assistant',
            content: turndown_service.turndown(article.content),
          })
        }
      })
      if (messages.length) {
        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          } as ReaderData.Chat),
        }
      }
    } else if (params.url.startsWith('https://huggingface.co/chat/')) {
      const temp_el = document.createElement('div')
      temp_el.innerHTML = params.html
      const user_selector =
        '.dark\\:text-gray-400.text-gray-500.py-3\\.5.px-5.bg-inherit.break-words.text-wrap.whitespace-break-spaces.appearance-none.w-full.disabled'
      const assistant_selector =
        '.dark\\:text-gray-300.dark\\:from-gray-800\\/40.dark\\:border-gray-800.prose-pre\\:my-2.text-gray-600.py-3\\.5.px-5.from-gray-50.bg-gradient-to-br.border-gray-100.border.rounded-2xl.break-words.min-w-\\[60px\\].min-h-\\[calc\\(2rem\\+theme\\(spacing\\[3\\.5\\]\\)\\*2\\)\\].relative'
      const message_divs = temp_el.querySelectorAll<HTMLElement>(
        `${user_selector}, ${assistant_selector}`,
      )
      const messages: ReaderData.Chat['conversation'] = []
      message_divs.forEach((el) => {
        if (el.matches(user_selector)) {
          messages.push({ author: 'user', text: el.textContent?.trim() || '' })
        } else if (el.matches(assistant_selector)) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(el.innerHTML, 'text/html')
          const article = new Readability(doc, { keepClasses: true }).parse()!
          messages.push({
            author: 'assistant',
            content: turndown_service.turndown(article.content),
          })
        }
      })
      if (messages.length) {
        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          } as ReaderData.Chat),
        }
      }
    } else if (params.url.startsWith('https://claude.ai/chat/')) {
      const temp_el = document.createElement('div')
      temp_el.innerHTML = params.html
      const user_selector = '.font-user-message'
      const assistant_selector = '.font-claude-message'
      const message_divs = temp_el.querySelectorAll<HTMLElement>(
        `${user_selector}, ${assistant_selector}`,
      )
      const messages: ReaderData.Chat['conversation'] = []
      message_divs.forEach((el) => {
        if (el.matches(user_selector)) {
          messages.push({ author: 'user', text: el.textContent?.trim() || '' })
        } else if (el.matches(assistant_selector)) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(el.innerHTML, 'text/html')
          const article = new Readability(doc, { keepClasses: true }).parse()!
          messages.push({
            author: 'assistant',
            content: turndown_service.turndown(article.content),
          })
        }
      })
      if (messages.length) {
        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          } as ReaderData.Chat),
        }
      }
    } else if (params.url.startsWith('https://coral.cohere.com/c/')) {
      const temp_el = document.createElement('div')
      temp_el.innerHTML = params.html
      const user_selector =
        '.hover\\:bg-mushroom-50.ease-in-out.transition-colors.md\\:flex-row.text-left.p-2.rounded-md.gap-2.flex-col.w-full.h-fit.flex.group:has(img[alt="Avatar user image"])'
      const assistant_selector =
        '.hover\\:bg-mushroom-50.ease-in-out.transition-colors.md\\:flex-row.text-left.p-2.rounded-md.gap-2.flex-col.w-full.h-fit.flex.group:has(svg[data-component="CoralLogo"])'
      const message_divs = temp_el.querySelectorAll<HTMLElement>(
        `${user_selector}, ${assistant_selector}`,
      )
      const messages: ReaderData.Chat['conversation'] = []
      message_divs.forEach((el) => {
        if (el.matches(user_selector)) {
          messages.push({ author: 'user', text: el.textContent?.trim() || '' })
        } else if (el.matches(assistant_selector)) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(el.innerHTML, 'text/html')
          const article = new Readability(doc, { keepClasses: true }).parse()!
          messages.push({
            author: 'assistant',
            content: turndown_service.turndown(article.content),
          })
        }
      })
      if (messages.length) {
        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          } as ReaderData.Chat),
        }
      }
    } else if (params.url.startsWith('https://www.reddit.com/')) {
      const temp_el = document.createElement('div')
      temp_el.innerHTML = params.html
      const post_element = temp_el.querySelector<HTMLElement>(
        '.xs\\:px-0.px-md.mb-xs.mb-sm',
      )
      const author_name = temp_el.querySelector<HTMLElement>(
        'faceplate-tracker > a.author-name',
      )?.innerText
      const subreddit_name = temp_el.querySelector<HTMLElement>(
        'faceplate-hovercard > a',
      )?.innerText
      if (post_element) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(post_element.innerHTML, 'text/html')
        const post = new Readability(doc, { keepClasses: true }).parse()!
        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.ARTICLE,
            author: author_name,
            site_name: `Reddit - ${subreddit_name}`,
            length: post.length,
            content: turndown_service.turndown(post.content),
          } as ReaderData.Article),
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
      const article = new Readability(doc, { keepClasses: true }).parse()!
      return {
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

// Joplin fork comes with no types.
import type TurndownService from 'turndown'
import TurndownServiceJoplin from '@joplin/turndown'
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

  const create_turndown_service = (): TurndownService => {
    const turndown_service: TurndownService = new TurndownServiceJoplin({
      codeBlockStyle: 'fenced',
    })
    turndown_service.use(turndownPluginGfm.gfm)
    // Convert code blocks to markdown.
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
    // Convert math blocks to markdown.
    turndown_service.addRule('multiplemath', {
      filter(node) {
        return node.nodeName == 'SPAN' && node.classList.contains('katex')
      },
      replacement(_, node) {
        // Check if the node is the only child of its parent paragraph.
        // Yes - block, no - inline.
        const is_block =
          node.parentNode?.nodeName == 'P' &&
          node.parentNode.childNodes.length == 1
        // "<annotation>" element holds expression string, right for markdown.
        const annotation = node.querySelector('annotation')?.textContent
        if (!annotation) return ''
        return is_block ? `$$ ${annotation} $$` : `$${annotation}$`
      },
    })
    turndown_service.addRule('stripImages', {
      filter: ['figure', 'picture', 'img'],
      replacement: () => '',
    })
    return turndown_service
  }

  const parse_chat_messages = (params: {
    html: string
    user_selector: string
    assistant_selector: string
    turndown_service: TurndownService
  }): ReaderData.Chat['conversation'] => {
    const temp_el = document.createElement('div')
    temp_el.innerHTML = params.html
    const message_divs = temp_el.querySelectorAll<HTMLElement>(
      `${params.user_selector}, ${params.assistant_selector}`,
    )
    const messages: ReaderData.Chat['conversation'] = []
    message_divs.forEach((el) => {
      if (el.matches(params.user_selector)) {
        messages.push({ role: 'user', content: el.textContent?.trim() || '' })
      } else if (el.matches(params.assistant_selector)) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(el.innerHTML, 'text/html')
        const article = new Readability(doc, { keepClasses: true }).parse()!
        messages.push({
          role: 'assistant',
          content: params.turndown_service.turndown(article.content),
        })
      }
    })
    return messages
  }

  export const parse = (params: Params): ParsedResult | undefined => {
    const turndown_service = create_turndown_service()

    // const titleRegex = /<title>(.*?)<\/title>/
    // const match = params.html.match(titleRegex)
    // let title: string = ''
    // if (match) {
    //   title = match[1]
    // }

    try {
      if (params.url.startsWith('https://chatgpt.com/')) {
        const user_selector = '[data-message-author-role="user"]'
        const assistant_selector = '[data-message-author-role="assistant"]'
        const messages = parse_chat_messages({
          html: params.html,
          user_selector,
          assistant_selector,
          turndown_service,
        })
        if (messages.length) {
          const reader_data: ReaderData.Chat = {
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          }
          return {
            reader_data: JSON.stringify(reader_data),
          }
        }
      } else if (params.url.startsWith('https://gemini.google.com/app/')) {
        const user_selector = '.query-content'
        const assistant_selector = '.response-content'
        const messages = parse_chat_messages({
          html: params.html,
          user_selector,
          assistant_selector,
          turndown_service,
        })
        if (messages.length) {
          const reader_data: ReaderData.Chat = {
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          }
          return {
            reader_data: JSON.stringify(reader_data),
          }
        }
      } else if (params.url.startsWith('https://huggingface.co/chat/')) {
        const user_selector =
          '.dark\\:text-gray-400.text-gray-500.py-3\\.5.px-5.bg-inherit.break-words.text-wrap.whitespace-break-spaces.appearance-none.w-full.disabled'
        const assistant_selector =
          '.dark\\:text-gray-300.dark\\:from-gray-800\\/40.dark\\:border-gray-800.prose-pre\\:my-2.text-gray-600.py-3\\.5.px-5.from-gray-50.bg-gradient-to-br.border-gray-100.border.rounded-2xl.break-words.min-w-\\[60px\\].min-h-\\[calc\\(2rem\\+theme\\(spacing\\[3\\.5\\]\\)\\*2\\)\\].relative'
        const messages = parse_chat_messages({
          html: params.html,
          user_selector,
          assistant_selector,
          turndown_service,
        })
        if (messages.length) {
          const reader_data: ReaderData.Chat = {
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          }
          return {
            reader_data: JSON.stringify(reader_data),
          }
        }
      } else if (params.url.startsWith('https://claude.ai/chat/')) {
        const user_selector = '.font-user-message'
        const assistant_selector = '.font-claude-message'
        const messages = parse_chat_messages({
          html: params.html,
          user_selector,
          assistant_selector,
          turndown_service,
        })
        if (messages.length) {
          const reader_data: ReaderData.Chat = {
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          }
          return {
            reader_data: JSON.stringify(reader_data),
          }
        }
      } else if (params.url.startsWith('https://coral.cohere.com/c/')) {
        const user_selector =
          '.hover\\:bg-mushroom-50.ease-in-out.transition-colors.md\\:flex-row.text-left.p-2.rounded-md.gap-2.flex-col.w-full.h-fit.flex.group:has(img[alt="Avatar user image"])'
        const assistant_selector =
          '.hover\\:bg-mushroom-50.ease-in-out.transition-colors.md\\:flex-row.text-left.p-2.rounded-md.gap-2.flex-col.w-full.h-fit.flex.group:has(svg[data-component="CoralLogo"])'
        const messages = parse_chat_messages({
          html: params.html,
          user_selector,
          assistant_selector,
          turndown_service,
        })
        if (messages.length) {
          const reader_data: ReaderData.Chat = {
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          }
          return {
            reader_data: JSON.stringify(reader_data),
          }
        }
      } else if (params.url.startsWith('https://chat.mistral.ai/chat/')) {
        const user_selector =
          '.gap-2.justify-between.items-stretch.flex-col.min-w-0.w-full.flex'
        const assistant_selector =
          '.font-light.prose-ol\\:pl-8.prose-pre\\:p-0.prose-pre\\:bg-\\[\\#1e1e1e\\].prose-pre\\:m-0.prose-code\\:whitespace-break-spaces.prose-code\\:m-0.prose-p\\:whitespace-break-spaces.dark\\:prose-invert.break-words.text-wrap.overflow-x-auto.select-text.max-w-none.prose-neutral.prose'
        const messages = parse_chat_messages({
          html: params.html,
          user_selector,
          assistant_selector,
          turndown_service,
        })
        if (messages.length) {
          const reader_data: ReaderData.Chat = {
            type: ReaderData.ContentType.CHAT,
            conversation: messages,
          }
          return {
            reader_data: JSON.stringify(reader_data),
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
          const doc = parser.parseFromString(
            post_element.innerHTML,
            'text/html',
          )
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
    } catch (error) {
      console.error('Error parsing HTML:', error)
      return undefined
    }
  }
}

import DOMPurify from 'dompurify'
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
    plain_text: string
  }

  const create_turndown_service = (): TurndownService => {
    const turndown_service: TurndownService = new TurndownServiceJoplin({
      codeBlockStyle: 'fenced',
    })
    turndown_service.use(turndownPluginGfm.gfm)
    // Convert code blocks to markdown
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
    // Convert math blocks to markdown
    turndown_service.addRule('multiplemath', {
      filter(node) {
        return (
          node.nodeName == 'SPAN' && node.classList.contains('katex-display')
        ) // Check if it's a display math block that centers equation
      },
      replacement(_, node) {
        // "<annotation>" element holds expression string, right for markdown
        const annotation = node.querySelector('annotation')?.textContent
        if (!annotation) return ''
        return `$$\n${annotation}\n$$`
      },
    })
    turndown_service.addRule('multiplemath', {
      filter(node) {
        return node.nodeName == 'SPAN' && node.classList.contains('katex')
      },
      replacement(_, node) {
        // Check if the node is the only child of its parent paragraph
        // Yes - block, no - inline
        const is_block =
          node.parentNode?.nodeName == 'P' &&
          node.parentNode.childNodes.length == 1
        // "<annotation>" element holds expression string, right for markdown
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
  }): {
    messages: ReaderData.Chat['conversation']
    plain_text: string
  } => {
    const temp_el = document.createElement('div')
    temp_el.innerHTML = DOMPurify.sanitize(params.html)
    const message_divs = temp_el.querySelectorAll<HTMLElement>(
      `${params.user_selector}, ${params.assistant_selector}`,
    )
    const messages: ReaderData.Chat['conversation'] = []
    let plain_text = ''
    message_divs.forEach((el) => {
      if (el.matches(params.user_selector)) {
        const content = el.textContent?.trim() || ''
        messages.push({ role: 'user', content })
        plain_text += `**User:** ${content}\n\n`
      } else if (el.matches(params.assistant_selector)) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(
          DOMPurify.sanitize(el.innerHTML),
          'text/html',
        )
        const article = new Readability(doc, { keepClasses: true }).parse()!
        const content = params.turndown_service.turndown(article.content)
        messages.push({
          role: 'assistant',
          content,
        })
        // Check if the content starts with a special markdown character
        const markdown_chars = ['#', '*', '`', '>', '-', '+', '1.']
        const starts_with_markdown = markdown_chars.some((char) =>
          content.startsWith(char),
        )
        if (starts_with_markdown) {
          plain_text += `**Assistant:**\n${content}\n\n`
        } else {
          plain_text += `**Assistant:** ${content}\n\n`
        }
      }
    })
    return { messages, plain_text }
  }

  export const parse = (params: Params): ParsedResult | undefined => {
    const turndown_service = create_turndown_service()

    const titleRegex = /<title>(.*?)<\/title>/
    const match = params.html.match(titleRegex)
    let title_element_text: string = ''
    if (match) {
      title_element_text = match[1]
    }

    try {
      if (
        // ChatGPT
        params.url.startsWith('https://chatgpt.com/')
      ) {
        const user_selector = '[data-message-author-role="user"]'
        const assistant_selector = '[data-message-author-role="assistant"]'
        const { messages, plain_text } = parse_chat_messages({
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
            plain_text,
          }
        }
      }
      // Gemini
      else if (params.url.startsWith('https://gemini.google.com/app/')) {
        const user_selector = '.query-content'
        const assistant_selector = '.response-content'
        const { messages, plain_text } = parse_chat_messages({
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
            plain_text,
          }
        }
      }
      // AI Studio
      else if (
        params.url.startsWith('https://aistudio.google.com/app/prompts/')
      ) {
        const user_selector =
          '.chat-turn-container:has(.role-container.user) .prompt-container'
        const assistant_selector =
          '.chat-turn-container:has(.role-container.model) .prompt-container'
        const { messages, plain_text } = parse_chat_messages({
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
            plain_text,
          }
        }
      }
      // HuggingFace
      else if (params.url.startsWith('https://huggingface.co/chat/')) {
        const user_selector =
          '.dark\\:text-gray-400.text-gray-500.py-3\\.5.px-5.bg-inherit.break-words.text-wrap.whitespace-break-spaces.appearance-none.w-full.disabled'
        const assistant_selector =
          '.dark\\:text-gray-300.dark\\:from-gray-800\\/40.dark\\:border-gray-800.prose-pre\\:my-2.text-gray-600.py-3\\.5.px-5.from-gray-50.bg-gradient-to-br.border-gray-100.border.rounded-2xl.break-words.min-w-\\[60px\\].min-h-\\[calc\\(2rem\\+theme\\(spacing\\[3\\.5\\]\\)\\*2\\)\\].relative'
        const { messages, plain_text } = parse_chat_messages({
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
            plain_text,
          }
        }
      }
      // Claude
      else if (params.url.startsWith('https://claude.ai/chat/')) {
        const user_selector = 'div.font-user-message'
        const assistant_selector = 'div.font-claude-message'
        const { messages, plain_text } = parse_chat_messages({
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
            plain_text,
          }
        }
      }
      // Cohere
      else if (params.url.startsWith('https://coral.cohere.com/c/')) {
        const user_selector =
          '.hover\\:bg-mushroom-50.ease-in-out.transition-colors.md\\:flex-row.text-left.p-2.rounded-md.gap-2.flex-col.w-full.h-fit.flex.group:has(img[alt="Avatar user image"])'
        const assistant_selector =
          '.hover\\:bg-mushroom-50.ease-in-out.transition-colors.md\\:flex-row.text-left.p-2.rounded-md.gap-2.flex-col.w-full.h-fit.flex.group:has(svg[data-component="CoralLogo"])'
        const { messages, plain_text } = parse_chat_messages({
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
            plain_text,
          }
        }
      }
      // Mistral
      else if (params.url.startsWith('https://chat.mistral.ai/chat/')) {
        const user_selector =
          '.gap-2.justify-between.items-stretch.flex-col.min-w-0.w-full.flex'
        const assistant_selector =
          '.font-light.prose-ol\\:pl-8.prose-pre\\:p-0.prose-pre\\:bg-\\[\\#1e1e1e\\].prose-pre\\:m-0.prose-code\\:whitespace-break-spaces.prose-code\\:m-0.prose-p\\:whitespace-break-spaces.dark\\:prose-invert.break-words.text-wrap.overflow-x-auto.select-text.max-w-none.prose-neutral.prose'
        const { messages, plain_text } = parse_chat_messages({
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
            plain_text,
          }
        }
      }
      // Open WebUI
      else if (
        params.html.includes(
          '<link rel="search" type="application/opensearchdescription+xml" title="Open WebUI" href="/opensearch.xml">',
        )
      ) {
        const user_selector = '#user-message'
        const assistant_selector = '.chat-assistant'
        const { messages, plain_text } = parse_chat_messages({
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
            plain_text,
          }
        }
      }
      // Reddit posts
      else if (params.url.startsWith('https://www.reddit.com/')) {
        const temp_el = document.createElement('div')
        temp_el.innerHTML = DOMPurify.sanitize(params.html)
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
            DOMPurify.sanitize(post_element.innerHTML),
            'text/html',
          )
          const post = new Readability(doc, { keepClasses: true }).parse()!
          const content = turndown_service.turndown(post.content)
          const plain_text = `${
            title_element_text ? `# ${title_element_text}\n\n` : ''
          }${strip_markdown_links(content)}`
          return {
            reader_data: JSON.stringify({
              type: ReaderData.ContentType.ARTICLE,
              author: author_name,
              title: title_element_text,
              site_name: `Reddit - ${subreddit_name}`,
              length: post.length,
              content,
            } as ReaderData.Article),
            plain_text,
          }
        }
      } else if (
        params.url.startsWith('https://twitter.com/') ||
        params.url.startsWith('https://x.com/')
      ) {
        const temp_el = document.createElement('div')
        temp_el.innerHTML = DOMPurify.sanitize(params.html)

        // Select the main tweet and all tweets that are part of the thread
        const tweet_elements = temp_el.querySelectorAll<HTMLElement>(
          'article:has(.r-12kyg2d.css-175oi2r > .r-1wtj0ep.r-18u37iz.r-k4xj1c.css-175oi2r), article:has(.r-14gqq1x.r-16y2uox.r-m5arl1.r-f8sm7e.r-1bnu78o.css-175oi2r), article:has(.r-15zivkp.r-onrtq4.r-1wron08.r-18kxxzh.css-175oi2r)',
        )

        let concatenated_tweets = ''

        tweet_elements.forEach((tweet_element) => {
          const parser = new DOMParser()
          const doc = parser.parseFromString(
            DOMPurify.sanitize(
              tweet_element.querySelector('[data-testid="tweetText"]')!
                .innerHTML,
            ),
            'text/html',
          )
          const tweet = new Readability(doc, { keepClasses: true }).parse()!
          concatenated_tweets +=
            turndown_service.turndown(tweet.content) + '\n\n'
        })
        // TODO, twitter to have special output type
        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.ARTICLE,
            title: title_element_text,
            site_name: 'Twitter',
            content: concatenated_tweets,
          } as ReaderData.Article),
          plain_text: strip_markdown_links(concatenated_tweets),
        }
      }
      // Telegram post (t.me/USER/POST_ID)
      else if (/^https:\/\/t\.me\/[^\/]+\/[^\/]+$/.test(params.url)) {
        const temp_el = document.createElement('div')
        temp_el.innerHTML = DOMPurify.sanitize(params.html)

        // Select the message content
        const post_element = temp_el.querySelector<HTMLElement>(
          'div.tgme_widget_message_text',
        )
        console.log(temp_el)
        console.log(post_element)
        if (post_element) {
          console.log(post_element)
          const parser = new DOMParser()
          const doc = parser.parseFromString(
            DOMPurify.sanitize(post_element.innerHTML),
            'text/html',
          )
          const post = new Readability(doc, { keepClasses: true }).parse()!
          const content = turndown_service.turndown(post.content)
          const plain_text = strip_markdown_links(content)
          return {
            reader_data: JSON.stringify({
              type: ReaderData.ContentType.ARTICLE,
              title: title_element_text,
              site_name: 'Telegram',
              content,
            } as ReaderData.Article),
            plain_text,
          }
        }
      }
      // Slack threads
      else if (params.url.startsWith('https://app.slack.com/client/')) {
        const temp_el = document.createElement('div')
        temp_el.innerHTML = DOMPurify.sanitize(params.html)

        // Select the threads flexpane
        const threads_flexpane = temp_el.querySelector<HTMLElement>(
          'div[data-qa="threads_flexpane"]',
        )
        if (threads_flexpane) {
          // Select all messages within the threads flexpane
          const message_elements =
            threads_flexpane.querySelectorAll<HTMLElement>(
              'div[data-qa="message_content"]',
            )
          let concatenated_messages = ''

          message_elements.forEach((message_element) => {
            console.log(message_element)
            const author = message_element.querySelector(
              'button[data-qa="message_sender_name"]',
            )
            const date = message_element.querySelector(
              'span[data-qa="timestamp_label"]',
            )
            if (author && date) {
              concatenated_messages +=
                (concatenated_messages != '' ? '\n' : '') +
                `@${author.textContent} (${date.textContent})\n`
            }
            const message = message_element.querySelector(
              'div[data-qa="message-text"]',
            )
            if (message) {
              concatenated_messages += message.textContent + '\n'
            }
          })

          return {
            reader_data: JSON.stringify({
              type: ReaderData.ContentType.ARTICLE,
              title: title_element_text,
              site_name: 'Slack',
              content: concatenated_messages,
            } as ReaderData.Article),
            plain_text: concatenated_messages,
          }
        }
      }
      // Issues like https://github.com/facebook/react/issues/29640
      else if (
        /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/issues\/\d+$/.test(params.url)
      ) {
        const temp_el = document.createElement('div')
        temp_el.innerHTML = DOMPurify.sanitize(params.html)

        // Select all comments in the issue
        const comment_elements =
          temp_el.querySelectorAll<HTMLElement>('.timeline-comment')

        let concatenated_comments = ''

        comment_elements.forEach((comment_element) => {
          const author =
            comment_element.querySelector<HTMLElement>('.author')?.innerText
          const date =
            comment_element.querySelector<HTMLElement>(
              '.js-timestamp',
            )?.innerText
          const content =
            comment_element.querySelector<HTMLElement>(
              '.comment-body',
            )?.innerHTML

          if (author && date && content) {
            const parser = new DOMParser()
            const doc = parser.parseFromString(
              DOMPurify.sanitize(content),
              'text/html',
            )
            const comment = new Readability(doc, { keepClasses: true }).parse()!
            concatenated_comments +=
              (concatenated_comments != '' ? '\n' : '') +
              `@${author} (${date})\n\n` +
              turndown_service.turndown(comment.content) +
              '\n\n\n'
          }
        })

        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.ARTICLE,
            title: title_element_text,
            site_name: 'GitHub',
            content: concatenated_comments,
          } as ReaderData.Article),
          plain_text: strip_markdown_links(concatenated_comments),
        }
      }
      // Generic articles
      else {
        const parser = new DOMParser()
        const doc = parser.parseFromString(
          DOMPurify.sanitize(params.html),
          'text/html',
        )
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
        const content = turndown_service.turndown(article.content)
        const title = article.title || title_element_text
        const plain_text = `${
          title ? `# ${title}\n\n` : ''
        }${strip_markdown_links(content)}`
        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.ARTICLE,
            title,
            site_name: article.siteName,
            published_at: article.publishedTime,
            author: article.byline,
            length: article.length,
            content,
          } as ReaderData.Article),
          plain_text,
        }
      }
    } catch (error) {
      console.error('Error parsing HTML:', error)
      return undefined
    }
  }
}

// Replace "[TEXT](URL)" with "[TEXT]()"
const strip_markdown_links = (text: string) => {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text) => `[${text}]()`)
}

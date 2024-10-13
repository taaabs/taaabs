import DOMPurify from 'dompurify'
import type TurndownService from 'turndown'
import TurndownServiceJoplin from '@joplin/turndown'
import * as turndownPluginGfm from '@joplin/turndown-plugin-gfm'
import { ReaderData } from './reader-data'
import { Readability, isProbablyReaderable } from '@mozilla/readability'
import { YouTubeTranscriptExtractor } from './helpers/youtube-transcript-extractor'

export namespace HtmlParser {
  export type Params = {
    url: string
    html: string
  }
  export type ParsedResult = {
    reader_data: string
    plain_text: string
  }

  export const create_turndown_service = (): TurndownService => {
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
    turndown_service.addRule('stripElements', {
      filter: ['figure', 'picture', 'sup'],
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
    message_divs.forEach((el, i) => {
      if (el.matches(params.user_selector)) {
        const content = el.textContent?.trim() || ''
        messages.push({ role: 'user', content })
        plain_text += `<user>\n${content}\n</user>\n`
      } else if (el.matches(params.assistant_selector)) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(el.innerHTML, 'text/html')
        const article = new Readability(doc, { keepClasses: true }).parse()!
        const content = params.turndown_service.turndown(article.content)
        messages.push({
          role: 'assistant',
          content,
        })
        plain_text += `<assistant>\n${content}\n</assistant>${
          i != message_divs.length - 1 ? '\n' : ''
        }`
      }
    })
    return { messages, plain_text }
  }

  export const parse = async (
    params: Params,
  ): Promise<ParsedResult | undefined> => {
    const turndown_service = create_turndown_service()

    const titleRegex = /<title>(.*?)<\/title>/
    const match = params.html.match(titleRegex)
    let title_element_text: string = ''
    if (match) {
      title_element_text = match[1]
    }

    try {
      // ChatGPT
      if (params.url.startsWith('https://chatgpt.com/')) {
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
        const user_selector = '.user-query-container'
        const assistant_selector = '.response-container-content'
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
            post_element.innerHTML,
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
        const tweet_element = temp_el.querySelector<HTMLElement>(
          'article[tabindex="-1"]',
        )
        if (tweet_element) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(
            tweet_element.querySelector('[data-testid="tweetText"]')!.innerHTML,
            'text/html',
          )
          const tweet = new Readability(doc, { keepClasses: true }).parse()!
          const content = turndown_service.turndown(tweet.content)
          return {
            reader_data: JSON.stringify({
              type: ReaderData.ContentType.ARTICLE,
              title: title_element_text,
              site_name: 'X',
              content,
            } as ReaderData.Article),
            plain_text: strip_markdown_links(content),
          }
        }
      }
      // Telegram post (t.me/USER/POST_ID)
      else if (/^https:\/\/t\.me\/[^\/]+\/[^\/]+$/.test(params.url)) {
        try {
          // Post is rendered in iframe, we need to grab the original html
          const embed_url = `${params.url}?embed=1&mode=tme`
          const response = await fetch(embed_url)
          const html_content = await response.text()
          const parser = new DOMParser()
          const doc = parser.parseFromString(html_content, 'text/html')
          if (!isProbablyReaderable(doc)) return
          const article = new Readability(doc, { keepClasses: true }).parse()
          if (article) {
            const content = turndown_service.turndown(article.content)
            const plain_text = strip_markdown_links(content)
            return {
              reader_data: JSON.stringify({
                type: ReaderData.ContentType.ARTICLE,
                title: plain_text.substring(0, 100),
                site_name: article.siteName,
                published_at: article.publishedTime,
                author: article.byline,
                length: article.length,
                content,
              } as ReaderData.Article),
              plain_text: strip_markdown_links(content),
            }
          }
        } catch (e) {
          console.error(e)
        }
      }
      // Gmail mail
      else if (
        params.url.startsWith('https://mail.google.com/mail/u/0/#inbox/')
      ) {
        const message_element = document.querySelector<HTMLElement>('div.ii.gt')
        if (message_element) {
          const parser = new DOMParser()
          const doc = parser.parseFromString(
            DOMPurify.sanitize(message_element.innerHTML),
            'text/html',
          )
          const post = new Readability(doc, { keepClasses: true }).parse()!
          const content = turndown_service.turndown(post.content)
          const plain_text = strip_markdown_links(content)
          return {
            reader_data: JSON.stringify({
              type: ReaderData.ContentType.ARTICLE,
              title: title_element_text,
              site_name: 'Gmail',
              content: plain_text,
            } as ReaderData.Article),
            plain_text: `# ${title_element_text}\n\n${plain_text}`,
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

        comment_elements.forEach((comment_element, i) => {
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
            const doc = parser.parseFromString(content, 'text/html')
            const comment = new Readability(doc, { keepClasses: true }).parse()
            if (comment) {
              concatenated_comments +=
                `**@${author}** (${date})\n\n` +
                turndown_service.turndown(comment.content) +
                (i == 0 ? '\n\n---\n\n' : '\n\n\n')
            }
          }
        })

        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.ARTICLE,
            title: title_element_text,
            site_name: 'GitHub',
            content: concatenated_comments,
          } as ReaderData.Article),
          plain_text: `# ${title_element_text}\n\n${strip_markdown_links(
            concatenated_comments,
          )}`,
        }
      }
      // Discussions like https://github.com/vercel/next.js/discussions/46722
      // We purposely don't include sub-discusisons (answers to answers)
      // as these are mostly off-topic.
      else if (
        /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/discussions\/[^\/]+$/.test(
          params.url,
        )
      ) {
        const temp_el = document.createElement('div')
        temp_el.innerHTML = DOMPurify.sanitize(params.html)

        // Select all comments in the discussion
        const comment_elements = temp_el.querySelectorAll<HTMLElement>(
          '.js-comment-container',
        )

        let concatenated_comments = ''

        comment_elements.forEach((comment_element, i) => {
          const author = comment_element
            .querySelector<HTMLElement>('.text-bold.Truncate-text')
            ?.innerText.trim()
          const date = comment_element
            .querySelector<HTMLElement>('.js-timestamp')
            ?.innerText.trim()
          const content =
            comment_element.querySelector<HTMLElement>(
              '.timeline-comment',
            )?.innerHTML

          if (author && date && content) {
            const parser = new DOMParser()
            const doc = parser.parseFromString(content, 'text/html')
            const comment = new Readability(doc, { keepClasses: true }).parse()
            if (comment) {
              concatenated_comments +=
                `**@${author}** (${date})\n\n` +
                turndown_service.turndown(comment.content) +
                (i == 0 ? '\n\n---\n\n' : '\n\n\n')
            }
          }
        })

        return {
          reader_data: JSON.stringify({
            type: ReaderData.ContentType.ARTICLE,
            title: title_element_text,
            site_name: 'GitHub',
            content: concatenated_comments,
          } as ReaderData.Article),
          plain_text: `# ${title_element_text}\n\n${strip_markdown_links(
            concatenated_comments,
          )}`,
        }
      }
      // TODO: YouTube should have it's own type
      else if (
        params.url.startsWith('https://www.youtube.com/watch?') ||
        params.url.startsWith('https://m.youtube.com/watch?')
      ) {
        const youtube_transcript_extractor = new YouTubeTranscriptExtractor(
          params.url,
        )
        const { reader_data, plain_text } =
          await youtube_transcript_extractor.get_transcript()

        return {
          reader_data: JSON.stringify(reader_data),
          plain_text,
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
        const article = new Readability(doc, { keepClasses: true }).parse()
        if (article) {
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
      }
    } catch (error) {
      console.error('Error parsing HTML:', error)
      return undefined
    }
  }
}

// Replace "[TEXT](URL)" with "[TEXT]()"
const strip_markdown_links = (text: string) => {
  return text.replace(/\[([^\]]*)\]\(([^)]*)\)/g, (_, text) => `[${text}]()`)
}

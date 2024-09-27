import { chatbot_urls } from '@/constants/chatbot-urls'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'

// Maximum allowed length of a plain text that can be sent to a chatbot
const PLAIN_TEXT_MAX_LENGTH = {
  default: 15000, // ChatGPT, Bing Copilot
  [chatbot_urls.gemini]: 30000,
  [chatbot_urls.claude]: 30000,
  [chatbot_urls.perplexity]: 38000,
  [chatbot_urls.huggingchat]: 45000,
  [chatbot_urls.deepseek]: 420000, // ~110k tokens
  [chatbot_urls.mistral]: 200000,
  [chatbot_urls.cohere]: 200000,
  [chatbot_urls.aistudio]: 3000000,
}

browser.runtime.onMessage.addListener(async (message, _, __) => {
  if (is_message(message) && message.action == 'send-chatbot-prompt') {
    const current_url = window.location.href
    const max_length =
      PLAIN_TEXT_MAX_LENGTH[current_url] || PLAIN_TEXT_MAX_LENGTH.default

    await AssistantBugMitigation.on_load(current_url)

    // Shorten plain text if necessary
    const shortened_plain_text =
      !current_url.startsWith('http://localhost') &&
      message.plain_text &&
      message.plain_text.length > max_length
        ? message.plain_text.substring(0, max_length) + '...'
        : message.plain_text

    // Send prompt
    const prompt = shortened_plain_text
      ? `<instruction>\n${message.prompt}\n</instruction>\n\n<text>\n${shortened_plain_text}\n</text>`
      : message.prompt

    send_prompt({ url: current_url, prompt })

    AssistantBugMitigation.scroll_to_response()
  }
})

const send_prompt = async (params: { url: string; prompt: string }) => {
  try {
    const input_element = AssistantBugMitigation.get_input_element(params.url)

    if (input_element && input_element.isContentEditable) {
      // Handle contenteditable element
      input_element.innerText = params.prompt

      // Dispatch input and change events
      input_element.dispatchEvent(new Event('input', { bubbles: true }))
      input_element.dispatchEvent(new Event('change', { bubbles: true }))

      const form = input_element.closest('form')

      if (params.url == chatbot_urls.claude) {
        setTimeout(() => {
          ;(
            document.querySelector(
              'button[aria-label="Send Message"]',
            ) as HTMLElement
          ).click()
        }, 500)
      } else if (form) {
        setTimeout(() => {
          form.requestSubmit()
        }, 0)
      } else {
        const enter_event = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
        })
        input_element.dispatchEvent(enter_event)
      }
    } else if (input_element && input_element.tagName == 'TEXTAREA') {
      // Handle input or textarea element
      ;(input_element as HTMLTextAreaElement).value = params.prompt

      // Dispatch input and change events
      input_element.dispatchEvent(new Event('input', { bubbles: true }))
      input_element.dispatchEvent(new Event('change', { bubbles: true }))

      const form = input_element.closest('form')
      if (form && params.url != chatbot_urls.copilot) {
        setTimeout(() => {
          form.requestSubmit()
        }, 0)
      } else if (params.url == chatbot_urls.cohere) {
        ;(
          document.querySelector(
            '.hover\\:bg-mushroom-100.text-mushroom-800.ease-in-out.transition.rounded.justify-center.items-center.flex-shrink-0.flex.md\\:my-4.ml-1.my-2.w-8.h-8',
          ) as HTMLElement
        )?.click()
      } else if (params.url == chatbot_urls.aistudio) {
        setTimeout(() => {
          ;(
            document.querySelector('button[aria-label=Run]') as HTMLElement
          )?.click()
        }, 0)
      } else {
        const enter_event = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
        })
        input_element.dispatchEvent(enter_event)
      }
    } else {
      throw new Error()
    }
  } catch {
    setTimeout(() => send_prompt(params), 100)
  }
}

namespace AssistantBugMitigation {
  export const on_load = async (url: string) => {
    // AI Studio and Mistral needs a little time before are ready to take a prompt.
    // Deepseek automatically restores previous conversation, we need to clear it.
    if (url == chatbot_urls.aistudio) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 1500)
      })
    } else if (url == chatbot_urls.mistral) {
      // Fix for mobile view
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 2000)
      })
    } else if (url == chatbot_urls.perplexity) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    } else if (url == chatbot_urls.deepseek) {
      // We first check if "Context cleared" element is there, meaning previous
      // conversation is loaded, then we repeatedly click "Clear context" button
      // until previous conversation is gone.
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          const context_cleared_text = document.querySelector(
            '#latest-context-divider',
          )
          if (!context_cleared_text) return

          const chat_message_sent_by_user = document.querySelector(
            '#latest-context-divider + ._18fe68b',
          )
          if (!chat_message_sent_by_user) {
            clearInterval(interval)
            resolve(true)
          } else {
            ;(
              document.querySelector('.ba62c862._64447e7') as HTMLElement
            ).click()
          }
        }, 500)
      })
    }
  }

  export const get_input_element = (chatbot_url: string) => {
    if (chatbot_url == chatbot_urls.copilot) {
      return (document as any)
        .querySelector('cib-serp')
        .shadowRoot.querySelector('cib-action-bar')
        .shadowRoot.querySelector('cib-text-input').shadowRoot.activeElement
    } else {
      let active_element = document.activeElement as HTMLElement

      const chatbot_selectors = {
        [chatbot_urls.huggingchat]:
          '.svelte-jxi03l.focus-visible\\:ring-0.focus\\:ring-0.outline-none.p-3.bg-transparent.border-0.overflow-y-scroll.overflow-x-hidden.scroll-p-3.resize-none.w-full.h-full.m-0.top-0.absolute.scrollbar-custom',
        [chatbot_urls.deepseek]: '#chat-input',
        [chatbot_urls.claude]: 'div[contenteditable=true] > p',
        [chatbot_urls.mistral]: 'textarea[placeholder="Ask anything!"]',
        [chatbot_urls.you]: 'textarea[name="query"]',
        [chatbot_urls.librechat]: 'textarea[placeholder*="Message "]',
      }

      const selector = chatbot_selectors[chatbot_url]
      if (selector) {
        active_element = document.querySelector(selector) as HTMLElement
      }

      return active_element
    }
  }

  export const scroll_to_response = () => {
    // Some chatbots don't follow scroll position with a generated response.
    // This fix first looks for model response container, then tries to scroll down.
    let scroll_container_selector = ''
    let response_container_selector = ''
    if (document.location.href == chatbot_urls.gemini) {
      scroll_container_selector = 'infinite-scroller'
      response_container_selector = 'message-content'
    } else if (document.location.href == chatbot_urls.chatgpt) {
      scroll_container_selector =
        '[class^="react-scroll-to-bottom--"].h-full > div'
      response_container_selector = 'div[data-message-author-role="assistant"]'
    } else if (document.location.href.startsWith(chatbot_urls.poe)) {
      scroll_container_selector =
        '[class^="ChatMessagesScrollWrapper_scrollableContainerWrapper"]'
      response_container_selector = '[class^="Message_leftSideMessageBubble"]'
    } else if (document.location.href.startsWith(chatbot_urls.perplexity)) {
      scroll_container_selector = 'html'
      response_container_selector =
        'div.bg-transparent.dark\\:border-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:divide-borderMainDark\\/50.divide-borderMain\\/50.ring-borderMain\\/50.border-borderMain\\/50:nth-of-type(2) > .dark\\:bg-backgroundDark.bg-background.dark\\:border-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:divide-borderMainDark\\/50.divide-borderMain\\/50.ring-borderMain\\/50.border-borderMain\\/50.justify-between.items-center.flex'
    }

    const try_scrolling = () => {
      const response_container = document.querySelector(
        response_container_selector,
      )
      if (response_container) {
        const scroll_container = document.querySelector(
          scroll_container_selector,
        )
        if (scroll_container) {
          const scroll_to_bottom = () => {
            scroll_container.scrollTop = scroll_container.scrollHeight
          }

          let previous_scroll_top: number | undefined = undefined
          const get_should_keep_scrolling = () => {
            const response_container = document.querySelector(
              response_container_selector,
            )!
            if (!response_container.textContent) return true

            const current_scroll_top = scroll_container.scrollTop
            if (
              previous_scroll_top &&
              current_scroll_top < previous_scroll_top
            ) {
              clearInterval(scroll_interval)
              return false
            }
            previous_scroll_top = current_scroll_top

            // Check if the model response is almost at the top of the viewport
            const model_response_rect =
              response_container.getBoundingClientRect()
            const top_threshold = 300 // Adjust the threshold as needed

            if (model_response_rect.top <= top_threshold) {
              clearInterval(scroll_interval)
              return false
            }

            return true
          }

          const scroll_interval = setInterval(() => {
            const should_keep_scrolling = get_should_keep_scrolling()
            if (should_keep_scrolling) {
              scroll_to_bottom()
            }
          }, 100)
        } else {
          console.error('Could not find scroll container.')
        }
      } else {
        console.error('Could not find response container.')
        setTimeout(() => {
          try_scrolling()
        }, 100)
      }
    }

    if (scroll_container_selector && response_container_selector) {
      try_scrolling()
    }
  }
}

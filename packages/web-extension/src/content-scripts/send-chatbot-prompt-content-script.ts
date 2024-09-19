import { chatbot_urls } from '@/constants/chatbot-urls'

// 15k characters is roughly a little below 4k tokens
const PART_MAX_LENGTH = {
  [chatbot_urls.chatgpt]: 15000,
  [chatbot_urls.gemini]: 30000,
  [chatbot_urls.perplexity]: 38000,
}

// Total length limits for each chatbot
const TOTAL_LENGTH_LIMIT = {
  [chatbot_urls.chatgpt]: 50000,
  [chatbot_urls.gemini]: 1000000,
  [chatbot_urls.perplexity]: 100000,
}

const send_prompt = async (params: {
  url: string
  prompt: string
  iteration?: number
  resolve?: (val: boolean) => void
}) => {
  try {
    // For multi-part prompts, check if chatbot has finished generating responses
    if (params.resolve) {
      try {
        if (params.url == chatbot_urls.chatgpt) {
          const answers = document.querySelectorAll(
            'button[data-testid="voice-play-turn-action-button"]',
          )
          if (params.iteration && params.iteration != answers.length) {
            throw new Error()
          }
        } else if (params.url == chatbot_urls.gemini) {
          const answers = document.querySelectorAll('message-actions')
          if (params.iteration && params.iteration != answers.length) {
            throw new Error()
          } else if (params.iteration) {
            // Slowish animations must finish, otherwise it hangs
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(true)
              }, 200)
            })
          }
        } else if (params.url == chatbot_urls.perplexity) {
          const answers = document.querySelectorAll('svg[data-icon="repeat"]')
          if (params.iteration && params.iteration != answers.length) {
            throw new Error()
          } else if (params.iteration) {
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(true)
              }, 0)
            })
          }
        } else if (params.url == chatbot_urls.mistral) {
          const answers = document.querySelectorAll(
            'button[aria-label="Rewrite"]',
          )
          if (params.iteration && params.iteration != answers.length) {
            throw new Error()
          }
        }
      } catch {
        throw new Error()
      }
    }

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
          params.resolve?.(true)
        }, 500)
      } else if (form) {
        setTimeout(() => {
          form.requestSubmit()
          params.resolve?.(true)
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
        params.resolve?.(true)
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
          params.resolve?.(true)
        }, 0)
      } else if (params.url == chatbot_urls.cohere) {
        ;(
          document.querySelector(
            '.hover\\:bg-mushroom-100.text-mushroom-800.ease-in-out.transition.rounded.justify-center.items-center.flex-shrink-0.flex.md\\:my-4.ml-1.my-2.w-8.h-8',
          ) as HTMLElement
        )?.click()
        params.resolve?.(true)
      } else if (params.url == chatbot_urls.aistudio) {
        setTimeout(() => {
          ;(
            document.querySelector('button[aria-label=Run]') as HTMLElement
          )?.click()
          params.resolve?.(true)
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
        params.resolve?.(true)
      }
    } else {
      throw new Error()
    }
  } catch {
    setTimeout(() => send_prompt(params), 100)
  }
}

chrome.runtime.onMessage.addListener(async (message, _, __) => {
  if (message.action == 'send-chatbot-prompt') {
    const current_url = window.location.href

    await AssistantBugMitigation.on_load(current_url)

    // Send prompt
    if (
      message.plain_text &&
      message.plain_text.length > PART_MAX_LENGTH[current_url] &&
      (current_url == chatbot_urls.chatgpt ||
        current_url == chatbot_urls.gemini ||
        current_url == chatbot_urls.perplexity)
    ) {
      let prompt_parts = []
      let total_length = 0
      let start_index = 0

      while (start_index < message.plain_text.length) {
        let part_length = Math.min(
          PART_MAX_LENGTH[current_url],
          message.plain_text.length - start_index,
        )

        // Adjust part length to ensure total length does not exceed limit
        if (total_length + part_length > TOTAL_LENGTH_LIMIT[current_url]) {
          part_length = TOTAL_LENGTH_LIMIT[current_url] - total_length
        }

        if (part_length <= 0) break

        const part = message.plain_text.substring(
          start_index,
          start_index + part_length,
        )
        prompt_parts.push(part)
        total_length += part_length
        start_index += part_length
      }

      // Send each part sequentially in a non blocking way
      const send_prompt_sequentially = async () => {
        for (let i = 0; i <= prompt_parts.length; i++) {
          const part = prompt_parts[i]
          let prompt = ''
          if (i < prompt_parts.length - 1) {
            prompt = `Text (part ${i + 1} of ${
              prompt_parts.length
            }):\n\n---\n\n${part}\n\n---\n\nText of this part ends here. Please reply with a single "OK gesture" emoji.`
          } else if (i == prompt_parts.length - 1) {
            prompt = `Text (part ${i + 1} of ${
              prompt_parts.length
            }):\n\n---\n\n${part}\n\n---\n\nText of the last part ends here. Now, as you have all the parts, treat them all as a single piece of text. Please reply with a single "OK gesture" emoji.`
          } else {
            prompt = message.prompt
          }

          await new Promise((resolve) =>
            send_prompt({
              url: current_url,
              prompt,
              iteration: i,
              resolve,
            }),
          )
        }
      }
      send_prompt_sequentially()
    } else if (current_url == chatbot_urls.mistral) {
      const prompt = message.plain_text
        ? `${message.prompt}\n\n---\n\n${message.plain_text.substring(
            0,
            100000,
          )}\n\n---\n\n`
        : message.prompt

      send_prompt({
        url: current_url,
        prompt,
      })
    } else {
      const prompt = message.plain_text
        ? `${message.prompt}\n\n---\n\n${message.plain_text}\n\n---\n\n`
        : message.prompt

      send_prompt({
        url: current_url,
        prompt,
      })
    }

    AssistantBugMitigation.scroll_to_response()
  }
})

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
        }, 1500)
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

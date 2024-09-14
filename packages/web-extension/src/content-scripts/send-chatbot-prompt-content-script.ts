import { chatbot_urls } from '@/constants/chatbot-urls'

chrome.runtime.onMessage.addListener(async (request, _, __) => {
  if (request.action == 'send-chatbot-prompt') {
    const current_url = window.location.href

    await AssistantFixes.on_load(current_url)

    // Roughly a little below 4k tokens
    const max_length = 15000

    // Send prompt
    if (
      request.plain_text.length > max_length &&
      (current_url == chatbot_urls.chatgpt ||
        current_url == chatbot_urls.gemini ||
        current_url == chatbot_urls.huggingchat)
    ) {
      let prompt_parts = []
      for (let i = 0; i < request.plain_text.length; i += max_length) {
        prompt_parts.push(request.plain_text.substring(i, i + max_length))
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
            prompt = request.prompt
          }

          await AssistantFixes.before_prompt_part({
            url: current_url,
            iteration: i,
          })

          await new Promise((resolve) =>
            send_prompt({
              url: current_url,
              prompt,
              is_first_part: i == 0,
              resolve,
            }),
          )
        }
      }
      send_prompt_sequentially()
    } else {
      const prompt = request.plain_text
        ? `${request.prompt}\n\n---\n\n${request.plain_text}`
        : request.prompt
      send_prompt({
        url: current_url,
        prompt,
        is_first_part: true,
      })
    }

    AssistantFixes.scroll_to_response()
  }
})

const send_prompt = async (params: {
  url: string
  prompt: string
  is_first_part: boolean
  resolve?: (val: boolean) => void
}) => {
  try {
    // This describes when we don't want to send new prompt just yet.
    // Is intended for multi-part prompts.
    if (params.resolve) {
      try {
        if (params.url == chatbot_urls.chatgpt) {
          if (
            document.querySelector('button[data-testid="stop-button"]') ||
            (document.querySelector(
              'button[data-testid="send-button"][disabled]',
            ) &&
              document.querySelector('div#prompt-textarea')?.textContent)
          ) {
            throw new Error()
          } else if (!params.is_first_part) {
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(true)
              }, 1000)
            })
          }
        } else if (params.url == chatbot_urls.gemini) {
          if (document.querySelector('svg[alt="skip response icon"]')) {
            throw new Error()
          } else if (!params.is_first_part) {
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(true)
              }, 1000)
            })
          }
        } else if (params.url == chatbot_urls.huggingchat) {
          if (
            document.querySelector(
              '.ml-auto.dark\\:hover\\:bg-gray-600.dark\\:bg-gray-700.dark\\:border-gray-600.hover\\:bg-gray-100.transition-all.shadow-sm.py-1.px-3.bg-white.border.rounded-lg.h-8.flex.btn',
            )
          ) {
            throw new Error()
          } else if (!params.is_first_part) {
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(true)
              }, 1000)
            })
          }
        }
      } catch {
        throw new Error()
      }
    }

    let active_element = document.activeElement as HTMLElement

    // Some chatbots have their inputs not focused by default.
    // Some applies to only smartphone widths: huggingchat, mistral, you
    let selector = ''
    if (params.url == chatbot_urls.huggingchat) {
      selector =
        '.svelte-jxi03l.focus-visible\\:ring-0.focus\\:ring-0.outline-none.p-3.bg-transparent.border-0.overflow-y-scroll.overflow-x-hidden.scroll-p-3.resize-none.w-full.h-full.m-0.top-0.absolute.scrollbar-custom'
    } else if (params.url == chatbot_urls.deepseek) {
      selector = '#chat-input'
    } else if (params.url == chatbot_urls.claude) {
      selector = 'div[contenteditable=true] > p'
    } else if (params.url == chatbot_urls.mistral) {
      selector = 'textarea[placeholder="Ask anything!"]'
    } else if (params.url == chatbot_urls.you) {
      selector = 'textarea[name="query"]'
    } else if (params.url == chatbot_urls.librechat) {
      selector = 'textarea[placeholder*="Message "]'
    }

    if (selector) {
      active_element = document.querySelector(selector) as HTMLElement
    }

    if (active_element && active_element.isContentEditable) {
      // Handle contenteditable element
      active_element.innerText = params.prompt

      // Dispatch input and change events
      active_element.dispatchEvent(new Event('input', { bubbles: true }))
      active_element.dispatchEvent(new Event('change', { bubbles: true }))

      const form = active_element.closest('form')

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
        active_element.dispatchEvent(enter_event)
        params.resolve?.(true)
      }
    } else if (active_element && active_element.tagName == 'TEXTAREA') {
      // Handle input or textarea element
      ;(active_element as HTMLTextAreaElement).value = params.prompt

      // Dispatch input and change events
      active_element.dispatchEvent(new Event('input', { bubbles: true }))
      active_element.dispatchEvent(new Event('change', { bubbles: true }))

      const form = active_element.closest('form')
      if (form) {
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
        active_element.dispatchEvent(enter_event)
        params.resolve?.(true)
      }
    } else {
      throw new Error()
    }
  } catch {
    setTimeout(() => send_prompt(params), 100)
  }
}

namespace AssistantFixes {
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
        }, 1000)
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

  export const before_prompt_part = async (params: {
    url: string
    iteration: number
  }) => {
    if (params.url == chatbot_urls.gemini && params.iteration > 0) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 1000)
      })
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

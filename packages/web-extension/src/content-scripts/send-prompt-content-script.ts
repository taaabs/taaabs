import { AssistantName } from '@/constants/assistants'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'

browser.runtime.onMessage.addListener(async (message, _, __) => {
  if (is_message(message) && message.action == 'send-prompt') {
    const assistant_name = message.assistant_name

    await AssistantBugMitigation.on_load({ assistant_name })

    // Handle image upload if present
    if (message.image) {
      await handle_image_upload({
        assistant_name,
        image: message.image,
      })
    }

    // Send prompt
    const prompt = message.plain_text
      ? `<instruction>\n${message.prompt}\n</instruction>\n\n<text>\n${message.plain_text}\n</text>`
      : message.prompt
    send_prompt({ prompt, assistant_name })

    AssistantBugMitigation.scroll_to_response({ assistant_name })
  }
})

const handle_image_upload = async (params: {
  assistant_name: AssistantName
  image: string
}) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 2000)
  })
  const img_input = document.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement
  if (img_input) {
    const blob = await fetch(params.image).then((res) => res.blob())
    const file = new File([blob], 'image.png', { type: 'image/png' })
    const data_transfer = new DataTransfer()
    data_transfer.items.add(file)
    img_input.files = data_transfer.files
    img_input.dispatchEvent(new Event('change', { bubbles: true }))
    if (params.assistant_name == 'chatgpt') {
      await new Promise(async (resolve) => {
        while (
          document.querySelector('button[data-testid="send-button"][disabled]')
        ) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 500)
          })
        }
        resolve(null)
      })
    } else if (params.assistant_name == 'claude') {
      await new Promise(async (resolve) => {
        while (
          // X button appearing on uploaded image
          !document.querySelector(
            '.hover\\:scale-105.transition.p-1.rounded-full.-translate-y-1\\/2.-translate-x-1\\/2.hover\\:text-oncolor-100.hover\\:bg-danger-100.bg-bg-000.text-text-500.border-border-200.border-0\\.5',
          )
        ) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 500)
          })
        }
        resolve(null)
      })
    } else if (params.assistant_name == 'mistral') {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 100)
      })
    }
  }
}

const send_prompt = async (params: {
  prompt: string
  assistant_name: AssistantName
}) => {
  try {
    const input_element = AssistantBugMitigation.get_input_element(
      params.assistant_name,
    )

    if (input_element && input_element.isContentEditable) {
      // Handle contenteditable element
      input_element.innerText = params.prompt

      // Dispatch input and change events
      input_element.dispatchEvent(new Event('input', { bubbles: true }))
      input_element.dispatchEvent(new Event('change', { bubbles: true }))

      const form = input_element.closest('form')

      if (params.assistant_name == 'claude') {
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
      if (form && params.assistant_name != 'copilot') {
        setTimeout(() => {
          form.requestSubmit()
        }, 0)
      } else if (params.assistant_name == 'cohere') {
        ;(
          document.querySelector(
            '.hover\\:bg-mushroom-100.text-mushroom-800.ease-in-out.transition.rounded.justify-center.items-center.flex-shrink-0.flex.md\\:my-4.ml-1.my-2.w-8.h-8',
          ) as HTMLElement
        )?.click()
      } else if (params.assistant_name == 'aistudio') {
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
  export const on_load = async (params: { assistant_name: AssistantName }) => {
    // AI Studio and Mistral needs a little time before are ready to take a prompt.
    // Deepseek automatically restores previous conversation, we need to clear it.
    if (params.assistant_name == 'aistudio') {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 1500)
      })
    } else if (params.assistant_name == 'mistral') {
      // Fix for mobile view
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 2000)
      })
    } else if (params.assistant_name == 'perplexity') {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    } else if (params.assistant_name == 'lobechat') {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    } else if (params.assistant_name == 'deepseek') {
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

  export const get_input_element = (assistant_name: AssistantName) => {
    if (assistant_name == 'copilot') {
      return (document as any)
        .querySelector('cib-serp')
        .shadowRoot.querySelector('cib-action-bar')
        .shadowRoot.querySelector('cib-text-input').shadowRoot.activeElement
    } else {
      let active_element = document.activeElement as HTMLElement

      const chatbot_selectors: Partial<Record<AssistantName, string>> = {
        huggingchat:
          '.svelte-jxi03l.focus-visible\\:ring-0.focus\\:ring-0.outline-none.p-3.bg-transparent.border-0.overflow-y-scroll.overflow-x-hidden.scroll-p-3.resize-none.w-full.h-full.m-0.top-0.absolute.scrollbar-custom',
        deepseek: '#chat-input',
        claude: 'div[contenteditable=true] > p',
        mistral: 'textarea[placeholder="Ask anything!"]',
        you: 'textarea[name="query"]',
        librechat: 'textarea[placeholder*="Message "]',
      }

      const selector = chatbot_selectors[assistant_name]
      if (selector) {
        active_element = document.querySelector(selector) as HTMLElement
      }

      return active_element
    }
  }

  export const scroll_to_response = (params: {
    assistant_name: AssistantName
  }) => {
    // Some chatbots don't follow scroll position with a generated response.
    // This fix first looks for model response container, then tries to scroll down.
    let scroll_container_selector = ''
    let response_container_selector = ''
    if (params.assistant_name == 'gemini') {
      scroll_container_selector = 'infinite-scroller'
      response_container_selector = 'message-content'
    } else if (params.assistant_name == 'chatgpt') {
      scroll_container_selector =
        '[class^="react-scroll-to-bottom--"].h-full > div'
      response_container_selector = 'div[data-message-author-role="assistant"]'
    } else if (params.assistant_name == 'poe') {
      scroll_container_selector =
        '[class^="ChatMessagesScrollWrapper_scrollableContainerWrapper"]'
      response_container_selector = '[class^="Message_leftSideMessageBubble"]'
    } else if (params.assistant_name == 'perplexity') {
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

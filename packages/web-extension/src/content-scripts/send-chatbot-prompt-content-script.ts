import { chatbot_urls } from '@/constants/chatbot-urls'

const current_url = window.location.href

chrome.runtime.onMessage.addListener(async (request, _, __) => {
  if (request.action == 'send-chatbot-prompt') {
    async function send_prompt(prompt: string) {
      let active_element = document.activeElement as HTMLElement

      // Some chatbots have their inputs not focused by default
      let selector = ''
      if (current_url == chatbot_urls.huggingchat) {
        selector =
          '.svelte-jxi03l.focus-visible\\:ring-0.focus\\:ring-0.outline-none.p-3.bg-transparent.border-0.overflow-y-scroll.overflow-x-hidden.scroll-p-3.resize-none.w-full.h-full.m-0.top-0.absolute.scrollbar-custom'
      } else if (current_url == chatbot_urls.cohere) {
        selector =
          '.leading-\\[150\\%\\].font-body.text-p.focus\\:outline-none.ease-in-out.transition.bg-marble-100.rounded.md\\:mb-1.mb-3.md\\:pt-4.md\\:pb-6.md\\:px-4.pt-2.pb-3.px-2.self-center.overflow-hidden.resize-none.flex-1.w-full'
      } else if (current_url == chatbot_urls.deepseek) {
        selector = '#chat-input'
      } else if (current_url == chatbot_urls.duckduckgo) {
        selector = 'textarea'
      } else if (current_url == chatbot_urls.mistral) {
        selector = "textarea[placeholder='Ask anything!']"
      } else if (current_url == chatbot_urls.claude) {
        selector = 'div[contenteditable=true] > p'
      }

      if (selector) {
        active_element = document.querySelector(selector) as HTMLElement
      }

      if (active_element && active_element.isContentEditable) {
        // Handle contenteditable element
        active_element.innerText = prompt

        // Dispatch input and change events
        active_element.dispatchEvent(new Event('input', { bubbles: true }))
        active_element.dispatchEvent(new Event('change', { bubbles: true }))

        const form = active_element.closest('form')

        if (current_url == chatbot_urls.claude) {
          setTimeout(() => {
            ;(
              document.querySelector(
                "button[aria-label='Send Message']",
              ) as HTMLElement
            ).click()
          }, 500)
        } else if (form) {
          form.requestSubmit()
        } else {
          const enter_event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
          })
          active_element.dispatchEvent(enter_event)
        }
      } else if (active_element && active_element.tagName == 'TEXTAREA') {
        // Handle input or textarea element
        if (current_url == chatbot_urls.duckduckgo) {
          ;(active_element as HTMLTextAreaElement).value = prompt.substring(
            0,
            16000,
          )
        } else {
          ;(active_element as HTMLTextAreaElement).value = prompt
        }

        // Dispatch input and change events
        active_element.dispatchEvent(new Event('input', { bubbles: true }))
        active_element.dispatchEvent(new Event('change', { bubbles: true }))

        const form = active_element.closest('form')
        if (form) {
          if (current_url == chatbot_urls.duckduckgo) {
            setTimeout(() => {
              form.requestSubmit()
            }, 0)
          } else {
            form.requestSubmit()
          }
        } else if (current_url == chatbot_urls.cohere) {
          ;(
            document.querySelector(
              '.hover\\:bg-mushroom-100.text-mushroom-800.ease-in-out.transition.rounded.justify-center.items-center.flex-shrink-0.flex.md\\:my-4.ml-1.my-2.w-8.h-8',
            ) as HTMLElement
          )?.click()
        } else if (current_url == chatbot_urls.aistudio) {
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

          active_element.dispatchEvent(enter_event)
        }
      } else {
        setTimeout(() => send_prompt(request.prompt), 50)
      }
    }

    // Fix for AI Studio and Mistral which has some work to do before being able to take a prompt
    if (current_url == chatbot_urls.aistudio) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 1000)
      })
    } else if (current_url == chatbot_urls.mistral) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    }

    send_prompt(request.prompt)

    // Some chatbots don't follow scroll position with a generated response.
    // Fix first looks for model response container, then tries to scroll down.
    let scroll_container_selector = ''
    let response_container_selector = ''
    if (document.location.href == chatbot_urls.duckduckgo) {
      scroll_container_selector = '.e8hNVcv2hNmgdRTcd0UO'
      response_container_selector = '.JXNYs5FNOplxLlVAOswQ'
    } else if (document.location.href == chatbot_urls.gemini) {
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
})

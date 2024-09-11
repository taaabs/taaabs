import { chatbot_urls } from '@/constants/chatbot-urls'

const current_url = window.location.href

chrome.runtime.onMessage.addListener(async (request, _, __) => {
  if (request.action == 'send-chatbot-prompt') {
    const send_prompt = async (
      prompt: string,
      resolve: (val: boolean) => void,
    ) => {
      try {
        // Handle multi-part prompts. When implementing this for other chatbots,
        // it's very important to investigate how the input field behave immediately
        // after submission. With ChatGPT it's stuck for a few seconds with a prompt.
        try {
          if (current_url == chatbot_urls.chatgpt) {
            if (
              document.querySelector('button[data-testid="stop-button"]') ||
              (document.querySelector(
                'button[data-testid="send-button"][disabled]',
              ) &&
                document.querySelector('div#prompt-textarea')?.textContent)
            ) {
              throw new Error()
            }
          }
          // TODO improve detection when the app is busy processing input field value
          // else if (current_url == chatbot_urls.gemini) {
          // if (document.querySelector('svg[alt="skip response icon"]')) {
          //   throw new Error()
          // }
          // }
        } catch {
          console.debug('Response generation is ongoing.')
          throw new Error()
        }

        let active_element = document.activeElement as HTMLElement

        // Some chatbots have their inputs not focused by default
        let selector = ''
        if (current_url == chatbot_urls.huggingchat) {
          // Not focused on mobile
          selector =
            '.svelte-jxi03l.focus-visible\\:ring-0.focus\\:ring-0.outline-none.p-3.bg-transparent.border-0.overflow-y-scroll.overflow-x-hidden.scroll-p-3.resize-none.w-full.h-full.m-0.top-0.absolute.scrollbar-custom'
        } else if (current_url == chatbot_urls.deepseek) {
          selector = '#chat-input'
        } else if (current_url == chatbot_urls.duckduckgo) {
          selector = 'textarea'
        } else if (current_url == chatbot_urls.claude) {
          selector = 'div[contenteditable=true] > p'
        } else if (current_url == chatbot_urls.mistral) {
          // Not focused on mobile
          selector = "textarea[placeholder='Ask anything!']"
        } else if (current_url == chatbot_urls.you) {
          // Not focused on mobile
          selector = 'textarea[name="query"]'
        } else if (current_url == chatbot_urls.librechat) {
          selector = 'textarea[placeholder*="Message "]'
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
              resolve(true)
            }, 500)
          } else if (form) {
            setTimeout(() => {
              form.requestSubmit()
              resolve(true)
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
            resolve(true)
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
            setTimeout(() => {
              form.requestSubmit()
              resolve(true)
            }, 0)
          } else if (current_url == chatbot_urls.cohere) {
            ;(
              document.querySelector(
                '.hover\\:bg-mushroom-100.text-mushroom-800.ease-in-out.transition.rounded.justify-center.items-center.flex-shrink-0.flex.md\\:my-4.ml-1.my-2.w-8.h-8',
              ) as HTMLElement
            )?.click()
            resolve(true)
          } else if (current_url == chatbot_urls.aistudio) {
            setTimeout(() => {
              ;(
                document.querySelector('button[aria-label=Run]') as HTMLElement
              )?.click()
              resolve(true)
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
            resolve(true)
          }
        } else {
          throw new Error()
        }
      } catch {
        setTimeout(() => send_prompt(prompt, resolve), 500)
      }
    }

    // AI Studio and Mistral needs a little time before are ready to take a prompt
    if (current_url == chatbot_urls.aistudio) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 1500)
      })
    } else if (current_url == chatbot_urls.mistral) {
      // Fix for mobile view
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    }

    const max_length = 15000

    // Send prompt.
    // TODO: gemini needs better detecition when busy in send_prompt
    if (
      request.plain_text.length > max_length &&
      current_url == chatbot_urls.chatgpt
      // ||
      // current_url == chatbot_urls.gemini
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
          if (i == 0) {
            prompt = `Text (part ${i + 1} of ${
              prompt_parts.length
            }):\n\n---\n\n${part}\n\n---\n\nEnd of part ${i + 1} of ${
              prompt_parts.length
            }. Now please reply with a single "OK gesture" emoji.`
          } else if (i < prompt_parts.length) {
            prompt = `Text (part ${i + 1} of ${
              prompt_parts.length
            }):\n\n---\n\n${part}\n\n---\n\nEnd of part ${i + 1} of ${
              prompt_parts.length
            }. Now please reply with a single "OK gesture" emoji.`
          } else {
            prompt = `Treat all the parts as a single piece of text. ${request.prompt}`
          }
          await new Promise((resolve) => send_prompt(prompt, resolve))
        }
      }
      send_prompt_sequentially()
    } else {
      const prompt = request.plain_text
        ? `**Instructions:** ${request.prompt}\n\n**Text:**\n\n${request.plain_text}`
        : request.prompt
      send_prompt(prompt, () => {})
    }

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

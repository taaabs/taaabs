chrome.runtime.onMessage.addListener(async (request, _, __) => {
  if (request.action == 'send-chatbot-prompt') {
    async function send_prompt(prompt: string) {
      let active_element = document.activeElement as HTMLElement

      // Some chatbots have their inputs not focused by default
      let selector = ''
      if (window.location.href == 'https://huggingface.co/chat/') {
        selector =
          '.svelte-jxi03l.focus-visible\\:ring-0.focus\\:ring-0.outline-none.p-3.bg-transparent.border-0.overflow-y-scroll.overflow-x-hidden.scroll-p-3.resize-none.w-full.h-full.m-0.top-0.absolute.scrollbar-custom'
      } else if (window.location.href == 'https://coral.cohere.com/') {
        selector =
          '.leading-\\[150\\%\\].font-body.text-p.focus\\:outline-none.ease-in-out.transition.bg-marble-100.rounded.md\\:mb-1.mb-3.md\\:pt-4.md\\:pb-6.md\\:px-4.pt-2.pb-3.px-2.self-center.overflow-hidden.resize-none.flex-1.w-full'
      } else if (window.location.href == 'https://chat.deepseek.com/') {
        selector = '#chat-input'
      } else if (
        window.location.href ==
        'https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat'
      ) {
        selector = 'textarea'
      } else if (window.location.href == 'https://chat.mistral.ai/chat') {
        selector = "textarea[placeholder='Ask anything!']"
      } else if (window.location.href == 'https://claude.ai/new') {
        selector = 'div[contenteditable=true] > p'
      }

      if (selector) {
        active_element = document.querySelector(selector) as HTMLElement
      }

      console.log(active_element)

      if (active_element && active_element.isContentEditable) {
        // Handle contenteditable element
        active_element.innerText = prompt

        // Dispatch input and change events
        active_element.dispatchEvent(new Event('input', { bubbles: true }))
        active_element.dispatchEvent(new Event('change', { bubbles: true }))

        const form = active_element.closest('form')

        if (window.location.href == 'https://claude.ai/new') {
          setTimeout(() => {
            ;(
              document.querySelector(
                "button[aria-label='Send Message']",
              ) as HTMLElement
            ).click()
          }, 0)
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
        ;(active_element as HTMLTextAreaElement).value = prompt

        // Dispatch input and change events
        active_element.dispatchEvent(new Event('input', { bubbles: true }))
        active_element.dispatchEvent(new Event('change', { bubbles: true }))

        const form = active_element.closest('form')
        if (form) {
          if (
            window.location.href ==
            'https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat'
          ) {
            setTimeout(() => {
              form.requestSubmit()
            }, 0)
          } else {
            form.requestSubmit()
          }
        } else if (window.location.href == 'https://coral.cohere.com/') {
          ;(
            document.querySelector(
              '.hover\\:bg-mushroom-100.text-mushroom-800.ease-in-out.transition.rounded.justify-center.items-center.flex-shrink-0.flex.md\\:my-4.ml-1.my-2.w-8.h-8',
            ) as HTMLElement
          )?.click()
        } else if (
          window.location.href ==
          'https://aistudio.google.com/app/prompts/new_chat'
        ) {
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

    // Fix for AI Studio and Mistral which has some work to do before being available to take a prompt
    if (
      window.location.href ==
        'https://aistudio.google.com/app/prompts/new_chat' ||
      window.location.href == 'https://chat.mistral.ai/chat'
    ) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 500)
      })
    }

    send_prompt(request.prompt)
  }
})

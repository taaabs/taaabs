chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action == 'send-chatbot-prompt') {
    function send_prompt(prompt: string) {
      if (document.activeElement) {
        const active_element = document.activeElement as HTMLElement

        if (active_element.isContentEditable) {
          // Handle contenteditable element
          active_element.innerText = prompt

          // Dispatch input and change events
          active_element.dispatchEvent(new Event('input', { bubbles: true }))
          active_element.dispatchEvent(new Event('change', { bubbles: true }))

          const form = active_element.closest('form')
          if (form) {
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
        } else if (active_element.tagName == 'TEXTAREA') {
          // Handle input or textarea element
          ;(active_element as HTMLTextAreaElement).value = prompt

          // Dispatch input and change events
          active_element.dispatchEvent(new Event('input', { bubbles: true }))
          active_element.dispatchEvent(new Event('change', { bubbles: true }))

          const form = active_element.closest('form')
          if (form) {
            // DuckDuckGo requires a little wait
            if (
              window.location.href ==
              'https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat'
            ) {
              setTimeout(() => {
                form.requestSubmit()
              }, 500)
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
                document.querySelector(
                  '.medium.chunk-prompt.ng-trigger-submit.ng-trigger.ng-tns-c895309486-2.run-button.mat-mdc-tooltip-trigger',
                ) as HTMLElement
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
        }
      }
    }

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
    }

    if (selector) {
      const element_to_focus = document.querySelector(selector) as HTMLElement
      element_to_focus?.focus()
    }

    // Some chatbots require a little bit longer wait
    if (
      window.location.href == 'https://aistudio.google.com/app/prompts/new_chat'
    ) {
      setTimeout(() => send_prompt(request.prompt), 1000)
    } else {
      setTimeout(() => send_prompt(request.prompt), 100)
    }
  }
})

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action == 'send-chatbot-prompt') {
    function attempt_to_send_prompt() {
      if (document.activeElement) {
        const active_element = document.activeElement as HTMLElement

        if (active_element.isContentEditable) {
          // Handle contenteditable element
          active_element.innerText = request.prompt

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
          ;(active_element as HTMLTextAreaElement).value = request.prompt

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
        }
      }
    }

    // Initial attempt to send the prompt
    setTimeout(attempt_to_send_prompt, 100)
  }
})

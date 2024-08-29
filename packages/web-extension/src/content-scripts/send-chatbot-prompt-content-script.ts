chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action == 'send-chatbot-prompt') {
    function attemptToSendPrompt() {
      if (
        document.activeElement &&
        document.activeElement.tagName == 'TEXTAREA'
      ) {
        const activeElement = document.activeElement as any
        activeElement.value = request.prompt
        activeElement.dispatchEvent(new Event('input', { bubbles: true }))
        activeElement.dispatchEvent(new Event('change', { bubbles: true }))
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
        })
        activeElement.dispatchEvent(enterEvent)
      } else {
        // Retry after 50ms if document.activeElement is not a textarea
        setTimeout(attemptToSendPrompt, 50)
      }
    }

    // Initial attempt to send the prompt
    setTimeout(attemptToSendPrompt, 50)
  }
})

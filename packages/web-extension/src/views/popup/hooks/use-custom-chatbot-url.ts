import { useEffect, useState } from 'react'

export const use_custom_chatbot_url = () => {
  const [custom_chatbot_url, set_custom_chatbot_url] = useState<string>()

  useEffect(() => {
    window.postMessage({ action: 'get-custom-chatbot-url' }, '*')

    // Listen for response from content script
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'custom-chatbot-url') {
        set_custom_chatbot_url(event.data.custom_chatbot_url || null)
      }
    }

    window.addEventListener('message', handle_message)
    return () => window.removeEventListener('message', handle_message)
  }, [])

  return {
    custom_chatbot_url,
  }
}

import { useEffect, useState } from 'react'

export const use_selected_chatbot = () => {
  const [selected_chatbot_name, set_selected_chatbot_name] = useState<string>()

  useEffect(() => {
    window.postMessage(
      {
        action: 'set-last-used-chatbot-name',
        last_used_chatbot_name: selected_chatbot_name,
      },
      '*',
    )
  }, [selected_chatbot_name])

  useEffect(() => {
    // Send message to content script to check if URL is saved
    window.postMessage({ action: 'get-last-used-chatbot-name' }, '*')

    // Listen for response from content script
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'last-used-chatbot-name') {
        set_selected_chatbot_name(event.data.last_used_chatbot_name)
      }
    }

    window.addEventListener('message', handle_message)
    return () => window.removeEventListener('message', handle_message)
  }, [])

  return {
    selected_chatbot_name,
    set_selected_chatbot_name,
  }
}

import { useEffect, useState } from 'react'

export const use_local_assistant_url = () => {
  const [local_assistant_url, set_local_assistant_url] = useState<string>()

  useEffect(() => {
    window.postMessage({ action: 'get-local-assistant-url' }, '*')

    // Listen for response from content script
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'local-assistant-url') {
        set_local_assistant_url(event.data.local_assistant_url || null)
      }
    }

    window.addEventListener('message', handle_message)
    return () => window.removeEventListener('message', handle_message)
  }, [])

  return {
    local_assistant_url,
  }
}

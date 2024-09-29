import { useEffect, useState } from 'react'

export const use_local_assistant_port = () => {
  const [local_assistant_port, set_local_assistant_port] = useState<number>()

  useEffect(() => {
    window.postMessage({ action: 'get-local-assistant-port' }, '*')

    // Listen for response from content script
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'local-assistant-port') {
        set_local_assistant_port(event.data.local_assistant_port || null)
      }
    }

    window.addEventListener('message', handle_message)
    return () => window.removeEventListener('message', handle_message)
  }, [])

  return {
    local_assistant_port,
  }
}

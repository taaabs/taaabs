import { useEffect, useState } from 'preact/hooks'

export const use_saved_check = () => {
  const [is_saved, set_is_saved] = useState<boolean>()

  useEffect(() => {
    // Send message to content script to check if URL is saved
    window.postMessage({ action: 'check-url-saved' }, '*')

    // Listen for response from content script
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'url-saved-status') {
        set_is_saved(event.data.is_saved)
      }
    }

    window.addEventListener('message', handle_message)
    return () => window.removeEventListener('message', handle_message)
  }, [])

  return {
    is_saved,
  }
}

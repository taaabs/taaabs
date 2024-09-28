import { useEffect, useState } from 'react'

export const use_saved_check = () => {
  const [is_saved, set_is_saved] = useState<boolean>()

  const check_is_saved = () => {
    window.postMessage({ action: 'check-url-saved' }, '*')
  }

  useEffect(() => {
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
    check_is_saved,
  }
}

import { useEffect, useState } from 'react'

export const use_auth_state = () => {
  const [is_authenticated, set_is_authenticated] = useState<boolean>()

  useEffect(() => {
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'auth-state') {
        set_is_authenticated(event.data.is_logged_id)
      }
    }
    window.addEventListener('message', handle_message)
    window.postMessage({ action: 'get-auth-state' }, '*')
    return () => window.removeEventListener('message', handle_message)
  }, [])

  return {
    is_authenticated,
  }
}

import { useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export const use_attach_text_checkbox = () => {
  const [is_checked, set_is_checked] = useState<boolean>()

  useEffect(() => {
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (
        event.data &&
        event.data.action == 'attach-text-checkbox-state'
      ) {
        set_is_checked(event.data.is_checked || false)
        window.removeEventListener('message', handle_message)
      }
    }

    window.addEventListener('message', handle_message)
    window.postMessage({ action: 'get-attach-text-checkbox-state' }, '*')
  }, [])

  useUpdateEffect(() => {
    window.postMessage(
      { action: 'set-attach-text-checkbox-state', is_checked },
      '*',
    )
  }, [is_checked])

  return {
    is_checked,
    set_is_checked,
  }
}
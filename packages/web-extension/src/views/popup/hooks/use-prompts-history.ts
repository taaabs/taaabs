import { useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'

export const use_prompts_history = () => {
  const [prompts_history, set_prompts_history] = useState<string[]>([])

  const restore_prompts_history = () => {
    window.postMessage({ action: 'get-prompts-history' }, '*')

    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'prompts-history') {
        set_prompts_history(event.data.prompts_history)
      }
    }

    window.addEventListener('message', handle_message)
    return () => window.removeEventListener('message', handle_message)
  }

  useUpdateEffect(() => {
    window.postMessage({ action: 'set-prompts-history', prompts_history }, '*')
  }, [prompts_history])

  return {
    prompts_history,
    set_prompts_history,
    restore_prompts_history,
  }
}

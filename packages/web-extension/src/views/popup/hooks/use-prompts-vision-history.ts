import { useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { default_vision_prompts } from '../data/default-prompts'

export const use_prompts_vision_history = () => {
  const [prompts_history, set_prompts_history] =
    useState<string[]>(default_vision_prompts)

  const restore_prompts_history = () => {
    window.postMessage({ action: 'get-prompts-vision-history' }, '*')

    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'prompts-vision-history') {
        set_prompts_history(event.data.prompts_vision_history)
      }
    }

    window.addEventListener('message', handle_message)
    return () => window.removeEventListener('message', handle_message)
  }

  useUpdateEffect(() => {
    const prompts_history_copy = new Set<string>(
      prompts_history.slice(-30).reverse(),
    )
    default_vision_prompts.forEach((prompt) => prompts_history_copy.add(prompt))

    window.postMessage(
      {
        action: 'set-prompts-vision-history',
        prompts_vision_history: [...prompts_history_copy].reverse(),
      },
      '*',
    )
  }, [prompts_history])

  useEffect(() => {
    restore_prompts_history()
  }, [])

  return {
    prompts_history,
    set_prompts_history,
    restore_prompts_history,
  }
}

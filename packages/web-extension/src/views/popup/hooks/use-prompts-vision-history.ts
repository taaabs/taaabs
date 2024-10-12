import { useEffect, useState } from 'react'
import { default_vision_prompts } from '../data/default-prompts'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import browser from 'webextension-polyfill'

export const use_prompts_vision_history = () => {
  const [prompts_history, set_prompts_history] = useState<string[]>(
    default_vision_prompts.reverse(),
  )

  const restore_prompts_history = () => {
    browser.storage.local.get('prompts_vision_history').then((data: any) => {
      if (data.prompts_vision_history) {
        set_prompts_history(data.prompts_vision_history)
      }
    })
  }

  useUpdateEffect(() => {
    const prompts_history_copy = new Set<string>(
      prompts_history.slice(-30).reverse(),
    )
    default_vision_prompts.forEach((prompt) => prompts_history_copy.add(prompt))

    browser.storage.local.set({
      prompts_history: [...prompts_history_copy].reverse(),
    })
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

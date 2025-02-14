import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'
import { default_prompts } from '../data/default-prompts'

export const use_prompts_history = () => {
  const [prompts_history, set_prompts_history] = useState<string[]>(
    default_prompts.reverse(),
  )

  const update_stored_prompts_history = (prompt: string) => {
    // Only add if not already present
    if (!prompts_history.includes(prompt)) {
      const new_prompts_history = [...prompts_history]
      new_prompts_history.push(prompt)

      // Create a Set to ensure uniqueness while preserving order
      const prompts_history_copy = new Set<string>(
        new_prompts_history.reverse(),
      )
      // Add defaults in case they were somehow removed
      default_prompts.forEach((prompt) => prompts_history_copy.add(prompt))

      browser.storage.local.set({
        prompts_history: [...prompts_history_copy].reverse(),
      })
    }
  }

  useEffect(() => {
    browser.storage.local.get('prompts_history').then((data: any) => {
      if (data.prompts_history) {
        set_prompts_history(data.prompts_history)
      }
    })
  }, [])

  return {
    prompts_history,
    update_stored_prompts_history,
  }
}

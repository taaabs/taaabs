import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'
import { default_prompts } from '../data/default-prompts'

export const use_prompts_history = () => {
  const [prompts_history, set_prompts_history] = useState<string[]>([
    ...default_prompts,
  ])

  const update_stored_prompts_history = (prompt: string) => {
    const new_prompts_history = prompts_history.filter((p) => p != prompt)
    new_prompts_history.push(prompt)

    browser.storage.local.set({
      prompts_history: new_prompts_history,
    })
  }

  const remove_prompt = async (prompt: string) => {
    const new_prompts_history = prompts_history.filter((p) => p != prompt)
    set_prompts_history(new_prompts_history)

    await browser.storage.local.set({
      prompts_history: new_prompts_history,
    })

    return true
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
    remove_prompt,
  }
}

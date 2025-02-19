import { AssistantName, assistants } from '@/constants/assistants'
import { useEffect, useState } from 'react'

const LAST_USED_ASSISTANT_KEY = 'last-used-assistant-name'

export const use_selected_assistant = () => {
  const [selected_assistant_name, set_selected_assistant_name] =
    useState<AssistantName>()

  useEffect(() => {
    const stored_assistant = localStorage.getItem(LAST_USED_ASSISTANT_KEY)
    set_selected_assistant_name(
      stored_assistant &&
        Object.keys(assistants).includes(stored_assistant as AssistantName)
        ? (stored_assistant as AssistantName)
        : 'chatgpt',
    )
  }, [])

  const change_selected_assistant = (assistant_name: AssistantName) => {
    set_selected_assistant_name(assistant_name)
    localStorage.setItem(LAST_USED_ASSISTANT_KEY, assistant_name)
  }

  return {
    selected_assistant_name,
    change_selected_assistant,
  }
}

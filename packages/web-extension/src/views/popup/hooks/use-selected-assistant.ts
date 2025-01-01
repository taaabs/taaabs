import { AssistantName, assistants } from '@/constants/assistants'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

export const use_selected_assistant = () => {
  const [selected_assistant_name, set_selected_assistant_name] =
    useState<AssistantName>()

  useEffect(() => {
    browser.storage.local.get('last_used_chatbot_name').then((data: any) => {
      set_selected_assistant_name(
        data.last_used_chatbot_name &&
          Object.keys(assistants).includes(
            data.last_used_chatbot_name as AssistantName,
          )
          ? data.last_used_chatbot_name
          : 'chatgpt',
      )
    })
  }, [])

  return {
    selected_assistant_name,
  }
}

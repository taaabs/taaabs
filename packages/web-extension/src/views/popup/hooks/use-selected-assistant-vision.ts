import { AssistantName, assistants_vision } from '@/constants/assistants'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

export const use_selected_assistant_vision = () => {
  const [selected_assistant_name, set_selected_assistant_name] =
    useState<AssistantName>()

  useUpdateEffect(() => {
    browser.storage.local.set({
      last_used_chatbot_vision_name: selected_assistant_name,
    })
  }, [selected_assistant_name])

  useEffect(() => {
    browser.storage.local
      .get('last_used_chatbot_vision_name')
      .then((data: any) => {
        set_selected_assistant_name(
          data.last_used_chatbot_vision_name &&
            assistants_vision.includes(
              data.last_used_chatbot_vision_name as AssistantName,
            )
            ? data.last_used_chatbot_vision_name
            : 'chatgpt',
        )
      })
  }, [])

  return {
    selected_assistant_name,
    set_selected_assistant_name,
  }
}

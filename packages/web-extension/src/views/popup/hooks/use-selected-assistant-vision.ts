import { AssistantName } from '@/constants/assistants'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useEffect, useState } from 'react'

export const use_selected_assistant_vision = () => {
  const [selected_assistant_name, set_selected_assistant_name] =
    useState<AssistantName>()

  useUpdateEffect(() => {
    window.postMessage(
      {
        action: 'set-last-used-chatbot-vision-name',
        last_used_chatbot_vision_name: selected_assistant_name,
      },
      '*',
    )
  }, [selected_assistant_name])

  useEffect(() => {
    // Send message to content script to check if URL is saved
    window.postMessage({ action: 'get-last-used-chatbot-vision-name' }, '*')

    // Listen for response from content script
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'last-used-chatbot-vision-name') {
        set_selected_assistant_name(event.data.last_used_chatbot_vision_name)
      }
    }

    window.addEventListener('message', handle_message)
    return () => window.removeEventListener('message', handle_message)
  }, [])

  return {
    selected_assistant_name,
    set_selected_assistant_name,
  }
}

import { GetLastUsedChatbotNameResponse } from '@/types/messages'
import { is_message } from '@/utils/is-message'

export const last_used_chatbot_name = () => {
  chrome.runtime.onMessage.addListener((request: any, _, sendResponse) => {
    if (
      is_message(request) &&
      request.action === 'get-last-used-chatbot-name'
    ) {
      chrome.storage.sync.get('last_used_chatbot_name', (result) => {
        if (!result.last_used_chatbot_name) {
          const default_chatbot = 'chatgpt'
          const response: GetLastUsedChatbotNameResponse = {
            last_used_chatbot_name: default_chatbot,
          }
          sendResponse(response)
        } else {
          const response: GetLastUsedChatbotNameResponse = {
            last_used_chatbot_name: result.last_used_chatbot_name,
          }
          sendResponse(response)
        }
      })
      return true
    }

    if (is_message(request) && request.action == 'set-last-used-chatbot-name') {
      chrome.storage.sync.set({
        last_used_chatbot_name: request.last_used_chatbot_name,
      })
      return true
    }
    return false
  })
}

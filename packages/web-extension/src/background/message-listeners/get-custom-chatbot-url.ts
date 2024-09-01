import { GetCustomChatbotUrlResponse } from '@/types/messages'
import { is_message } from '@/utils/is-message'

export const get_custom_chatbot_url = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (is_message(request) && request.action == 'get-custom-chatbot-url') {
      chrome.storage.local.get(
        'custom_chatbot_url',
        ({ custom_chatbot_url }) => {
          const response: GetCustomChatbotUrlResponse = {
            custom_chatbot_url,
          }
          sendResponse(response)
        },
      )
      return true
    }
  })
}

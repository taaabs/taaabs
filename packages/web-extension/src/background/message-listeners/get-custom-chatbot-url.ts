export const get_custom_chatbot_url = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action == 'get-custom-chatbot-url') {
      chrome.storage.local.get('custom_chatbot_url', (data) => {
        sendResponse({ custom_chatbot_url: data.custom_chatbot_url || '' })
      })
      return true
    }
  })
}

export const last_used_chatbot_name = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action == 'get-last-used-chatbot-name') {
      chrome.storage.sync.get('last_used_chatbot_name', (result) => {
        if (!result.last_used_chatbot_name) {
          const default_chatbot = 'chatgpt'
          sendResponse({ last_used_chatbot_name: default_chatbot })
        } else {
          sendResponse({ last_used_chatbot_name: result.last_used_chatbot_name })
        }
      })
      return true
    }
    if (request.action == 'set-last-used-chatbot-name') {
      chrome.storage.sync.set({ last_used_chatbot_name: request.last_used_chatbot_name })
      return true
    }
    return false
  })
}

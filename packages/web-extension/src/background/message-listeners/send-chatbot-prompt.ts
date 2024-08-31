export const send_chatbot_prompt = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action == 'send-chatbot-prompt') {
      let chatbot_url = ''
      const chatbot_name = request.chatbot_name
      if (chatbot_name == 'chatgpt') {
        chatbot_url = 'https://chatgpt.com/'
      } else if (chatbot_name == 'gemini') {
        chatbot_url = 'https://gemini.google.com/app'
      } else if (chatbot_name == 'mistral') {
        chatbot_url = 'https://chat.mistral.ai/chat'
      } else if (chatbot_name == 'cohere') {
        chatbot_url = 'https://coral.cohere.com/'
      } else if (chatbot_name == 'duckduckgo') {
        chatbot_url = 'https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat'
      } else if (chatbot_name == 'huggingchat') {
        chatbot_url = 'https://huggingface.co/chat/'
      } else if (chatbot_name == 'aistudio') {
        chatbot_url = 'https://aistudio.google.com/app/prompts/new_chat'
      } else if (chatbot_name == 'deepseek') {
        chatbot_url = 'https://chat.deepseek.com/'
      }

      chrome.storage.sync.get('open_chatbot_in_new_tab', (data) => {
        const open_in_new_tab = data.open_chatbot_in_new_tab
        if (open_in_new_tab) {
          chrome.tabs.create({ url: chatbot_url }, (new_tab) => {
            const listener = (
              details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
            ) => {
              if (
                details.tabId == new_tab.id &&
                details.frameId == 0 &&
                details.url == chatbot_url
              ) {
                chrome.webNavigation.onCompleted.removeListener(listener)
                chrome.tabs.sendMessage(new_tab.id!, {
                  action: 'send-chatbot-prompt',
                  prompt: request.prompt,
                })
              }
            }
            chrome.webNavigation.onCompleted.addListener(listener)
          })
        } else {
          const popup_width = 767
          const window_width = request.window_width
          const window_height = request.window_height

          chrome.windows.create(
            {
              url: chatbot_url,
              type: 'popup',
              width: popup_width,
              height: window_height,
              left: Math.round((window_width - popup_width) / 2),
            },
            (new_window) => {
              const listener = (
                details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
              ) => {
                if (
                  details.tabId == new_window!.tabs![0].id &&
                  details.frameId == 0 &&
                  details.url == chatbot_url
                ) {
                  chrome.webNavigation.onCompleted.removeListener(listener)
                  chrome.tabs.sendMessage(new_window!.tabs![0].id!, {
                    action: 'send-chatbot-prompt',
                    prompt: request.prompt,
                  })
                }
              }
              chrome.webNavigation.onCompleted.addListener(listener)
            },
          )
        }
      })
    }
    return false
  })
}

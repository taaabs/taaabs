export const send_chatbot_prompt = () => {
  chrome.runtime.onMessage.addListener((request, _, __) => {
    if (request.action == 'send-chatbot-prompt') {
      chrome.storage.local.get(
        [
          'open_chatbot_in_new_tab',
          'chatbot_window_position',
          'chatbot_window_width',
        ],
        (data) => {
          const open_in_new_tab = data.open_chatbot_in_new_tab
          const chatbot_window_position =
            data.chatbot_window_position || 'middle'
          const chatbot_window_width = data.chatbot_window_width || 767

          if (open_in_new_tab) {
            chrome.tabs.create({ url: request.chatbot_url }, (new_tab) => {
              const listener = (
                details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
              ) => {
                if (
                  details.tabId == new_tab.id &&
                  details.frameId == 0 &&
                  details.url == request.chatbot_url
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
            const popup_width = chatbot_window_width
            const window_width = request.window_width
            const window_height = request.window_height

            let left_position: number
            if (chatbot_window_position == 'left') {
              left_position = 0
            } else if (chatbot_window_position == 'right') {
              left_position = window_width - popup_width
            } else {
              // Middle
              left_position = Math.round((window_width - popup_width) / 2)
            }

            chrome.windows.create(
              {
                url: request.chatbot_url,
                type: 'popup',
                width: popup_width,
                height: window_height,
                left: left_position,
              },
              (new_window) => {
                const listener = (
                  details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
                ) => {
                  if (
                    details.tabId == new_window!.tabs![0].id &&
                    details.frameId == 0 &&
                    details.url == request.chatbot_url
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
        },
      )
    }
    return false
  })
}

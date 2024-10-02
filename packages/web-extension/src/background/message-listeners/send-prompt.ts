import { SendPrompt_Message } from '@/types/messages'
import { is_message } from '@/utils/is-message'
import browser from 'webextension-polyfill'

export const send_prompt = () => {
  browser.runtime.onMessage.addListener((request): any => {
    if (is_message(request) && request.action == 'send-prompt') {
      browser.storage.local
        .get([
          'open_chatbot_in_new_tab',
          'chatbot_window_position',
          'chatbot_window_width',
        ])
        .then(async (data: any) => {
          const open_in_new_tab =
            data.open_chatbot_in_new_tab || request.open_in_new_tab
          const chatbot_window_position =
            data.chatbot_window_position || 'middle'
          const chatbot_window_width = data.chatbot_window_width || 767

          if (open_in_new_tab) {
            const new_tab = await browser.tabs.create({
              url: request.assistant_url,
            })
            const onCompletedListener = async (details: any) => {
              if (
                details.tabId == new_tab.id &&
                details.frameId == 0 &&
                details.url == request.assistant_url
              ) {
                browser.webNavigation.onCompleted.removeListener(
                  onCompletedListener,
                )
                await browser.tabs.sendMessage(new_tab.id!, {
                  action: 'send-prompt',
                  assistant_name: request.assistant_name,
                  prompt: request.prompt,
                  plain_text: request.plain_text,
                  image: request.image
                } as SendPrompt_Message)
              }
            }
            browser.webNavigation.onCompleted.addListener(onCompletedListener)
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

            const new_window = await browser.windows.create({
              url: request.assistant_url,
              type: 'popup',
              width: popup_width,
              height: window_height,
              left: left_position,
            })

            const onCompletedListener = async (details: any) => {
              if (
                details.tabId === new_window?.tabs![0].id &&
                details.frameId === 0 &&
                details.url === request.assistant_url
              ) {
                browser.webNavigation.onCompleted.removeListener(
                  onCompletedListener,
                )
                await browser.tabs.sendMessage(new_window.tabs![0].id!, {
                  action: 'send-prompt',
                  assistant_name: request.assistant_name,
                  prompt: request.prompt,
                  plain_text: request.plain_text,
                  image: request.image
                } as SendPrompt_Message)
              }
            }
            browser.webNavigation.onCompleted.addListener(onCompletedListener)

            const useBoundsChanged =
              chrome !== undefined && chrome.windows?.onBoundsChanged

            if (useBoundsChanged) {
              chrome.windows.onBoundsChanged.addListener((window) => {
                if (
                  window.id == new_window.id &&
                  // Popup is not opened from another popup
                  popup_width != window_width
                ) {
                  let position: 'left' | 'middle' | 'right' = 'middle'
                  if (window.left! < 100) {
                    position = 'left'
                  } else if (window.left! > window_width - popup_width - 100) {
                    position = 'right'
                  }
                  browser.storage.local.set({
                    chatbot_window_position: position,
                    chatbot_window_width: Math.max(300, window.width!),
                  })
                }
              })
            } else {
              // Implement polling to detect window size and position changes
              let last_left = left_position
              let last_width = popup_width

              const poll_interval = 1000

              const poll_window_changes = async () => {
                const win = await browser.windows.get(new_window.id!, {
                  populate: false,
                })

                if (win.left != last_left || win.width != last_width) {
                  if (win.left != null && win.width != null) {
                    let position: 'left' | 'middle' | 'right' = 'middle'
                    if (win.left < 100) {
                      position = 'left'
                    } else if (win.left > window_width - win.width - 100) {
                      position = 'right'
                    }
                    await browser.storage.local.set({
                      chatbot_window_position: position,
                      chatbot_window_width: Math.max(300, win.width),
                    })

                    // Update last known values
                    last_left = win.left
                    last_width = win.width
                  }
                }
              }

              const interval_id = setInterval(
                poll_window_changes,
                poll_interval,
              )

              browser.windows.onRemoved.addListener((window_id) => {
                if (window_id == new_window.id) {
                  clearInterval(interval_id) // Stop polling when the window is closed
                }
              })
            }
          }
        })
    }
    return false
  })
}

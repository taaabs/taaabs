import { is_message } from '@/utils/is-message'
import browser from 'webextension-polyfill'

export const popup_closed = () => {
  browser.runtime.onMessage.addListener((message: any, _, __): any => {
    if (is_message(message) && message.action == 'popup-closed') {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0] && tabs[0].id) {
          browser.tabs.sendMessage(tabs[0].id, message)
        }
      })
    }
  })
}

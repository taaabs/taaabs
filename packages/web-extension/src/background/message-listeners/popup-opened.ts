import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'

export const popup_opened = () => {
  browser.runtime.onMessage.addListener((message: any, _, __): any => {
    if (is_message(message) && message.action == 'popup-opened') {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0] && tabs[0].id) {
          browser.tabs.sendMessage(tabs[0].id, message)
        }
      })
    }
  })
}

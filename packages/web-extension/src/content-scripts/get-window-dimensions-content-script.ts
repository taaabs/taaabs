import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'
import { WindowDimensions_Message } from '@/types/messages'

browser.runtime.onMessage.addListener((message: any, _, __): any => {
  if (is_message(message) && message.action == 'get-window-dimensions') {
    const message: WindowDimensions_Message = {
      action: 'window-dimensions',
      width: window.outerWidth,
      height: window.outerHeight,
    }
    browser.runtime.sendMessage(message)
  }
  return false
})

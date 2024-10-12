import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'
import { SelectedText_Message } from '@/types/messages'

browser.runtime.onMessage.addListener((message: any, _, __): any => {
  if (is_message(message) && message.action == 'get-selected-text') {
    const selection = window.getSelection()
    const selected_text = selection ? selection.toString() : ''
    const message: SelectedText_Message = {
      action: 'selected-text',
      selected_text,
    }
    browser.runtime.sendMessage(message)
  }
  return false
})

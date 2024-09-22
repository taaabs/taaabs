import { get_url_is_saved } from '../get-url-is-saved'
import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'

export const open_popup = () => {
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (is_message(request) && request.action == 'open-popup') {
      browser.tabs.sendMessage(sender.tab!.id!, { action: 'inject-popup' })
    } else if (is_message(request) && request.action === 'check-url-saved') {
      browser.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
        const currentTab = tabs[0]
        const is_saved = await get_url_is_saved(currentTab.url!)
        sendResponse({ is_saved })
      })
      return true // Indicates that the response is asynchronous
    }
  })
}
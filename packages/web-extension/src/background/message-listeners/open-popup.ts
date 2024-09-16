import { get_url_is_saved } from '../get-url-is-saved'

export const open_popup = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == 'open-popup') {
      chrome.tabs.sendMessage(sender.tab!.id!, { action: 'inject-popup' })
    } else if (request.action === 'check-url-saved') {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const currentTab = tabs[0]
        const is_saved = await get_url_is_saved(currentTab.url!)
        sendResponse({ is_saved })
      })
      return true // Indicates that the response is asynchronous
    }
  })
}

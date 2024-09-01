import { CheckUrlSavedResponse } from '@/types/messages'
import { is_message } from '@/utils/is-message'

export const check_url_saved = () => {
  chrome.runtime.onMessage.addListener((request: any, _, sendResponse) => {
    if (is_message(request) && request.action == 'check-url-saved') {
      ;(async () => {
        const [current_tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })
        const has_badge_text = !!(await chrome.action.getBadgeText({
          tabId: current_tab.id,
        }))
        const response: CheckUrlSavedResponse = { is_saved: has_badge_text }
        sendResponse(response)
      })()
      return true
    }
    return false
  })
}

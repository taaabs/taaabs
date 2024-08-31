export const check_url_saved = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action == 'check-url-saved') {
      ;(async () => {
        const [current_tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })
        const has_badge_text = !!(await chrome.action.getBadgeText({
          tabId: current_tab.id,
        }))
        sendResponse({ is_saved: has_badge_text })
      })()
      return true
    }
    return false
  })
}

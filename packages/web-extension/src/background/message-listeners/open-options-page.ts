export const open_options_page = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action == 'open-options-page') {
      chrome.runtime.openOptionsPage()
    }
    return false
  })
}

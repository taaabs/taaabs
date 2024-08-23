chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action == 'get-theme') {
    const theme = localStorage.getItem('theme')
    sendResponse({ theme })
  }
})

window.addEventListener('storage', (event: StorageEvent) => {
  if (event.key == 'theme') {
    const new_theme = event.newValue
    chrome.runtime.sendMessage({ action: 'theme-changed', theme: new_theme })
  }
})

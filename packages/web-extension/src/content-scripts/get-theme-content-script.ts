chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action == 'get-theme') {
    const theme = localStorage.getItem('theme')
    console.log('Currently set theme:', theme)
    sendResponse({ theme })
  }
})

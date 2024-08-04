chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action == 'get_auth_data') {
    const auth_data = localStorage.getItem('auth-data')
    sendResponse(auth_data)
  }
})

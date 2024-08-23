chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action == 'get-auth-data') {
    let auth_data
    auth_data = localStorage.getItem('auth-data')
    if (!auth_data) {
      auth_data = localStorage.getItem('guest-auth-data')
    }
    sendResponse(auth_data)
  }
})

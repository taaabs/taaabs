chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action == 'read_auth_data_at_taaabs_com') {
    let auth_data
    auth_data = localStorage.getItem('auth-data')
    if (!auth_data) {
      auth_data = localStorage.getItem('guest-auth-data')
    }
    sendResponse(auth_data)
  }
})

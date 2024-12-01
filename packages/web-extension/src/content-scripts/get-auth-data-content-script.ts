import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'

browser.runtime.onMessage.addListener((request: any, _, sendResponse): any => {
  if (is_message(request) && request.action == 'get-auth-data') {
    let auth_data
    auth_data = localStorage.getItem('auth-data')
    if (!auth_data) {
      auth_data = localStorage.getItem('guest-auth-data')
    }
    sendResponse(auth_data)
  }
})

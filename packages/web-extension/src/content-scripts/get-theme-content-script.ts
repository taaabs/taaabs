import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'

browser.runtime.onMessage.addListener((request: any, _, sendResponse): any => {
  if (is_message(request) && request.action === 'get-theme') {
    const theme = localStorage.getItem('theme')
    console.debug('Currently set theme:', theme)
    sendResponse({ theme })
  }
})

import { LocalDataStore } from '@/types/local-data-store'
import { GetAuthDataResponse } from '@/types/messages'
import { is_message } from '@/utils/is-message'
import browser from 'webextension-polyfill'

export const get_auth_data = () => {
  browser.runtime.onMessage.addListener((request, _, sendResponse): any => {
    if (is_message(request) && request.action == 'get-auth-data') {
      browser.storage.local.get('auth_data').then((data: LocalDataStore) => {
        const response: GetAuthDataResponse = data.auth_data!
        sendResponse(response)
      })
      return true
    }
    return false
  })
}

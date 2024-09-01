import { LocalDataStore } from '@/types/local-data-store'
import { GetAuthDataResponse } from '@/types/messages'
import { is_message } from '@/utils/is-message'

export const get_auth_data = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (is_message(request) && request.action == 'get-auth-data') {
      chrome.storage.local.get('auth_data', (data: LocalDataStore) => {
        const response: GetAuthDataResponse = data.auth_data!
        sendResponse(response)
        return true
      })
    }
    return false
  })
}

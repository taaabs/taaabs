import { LocalDataStore } from '@/types/local-data-store'

export const get_auth_data = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action == 'get-auth-data') {
      chrome.storage.local.get('auth_data', (result: LocalDataStore) => {
        sendResponse(result.auth_data)
        return true
      })
    }
    return false
  })
}

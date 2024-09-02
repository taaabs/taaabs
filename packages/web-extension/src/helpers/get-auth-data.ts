import { LocalDataStore } from '@/types/local-data-store'

export const get_auth_data = async (): Promise<{
  access_token: string
  refresh_token: string
  encryption_key: Array<number>
}> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['auth_data'], (result: LocalDataStore) => {
      resolve(result.auth_data!)
    })
  })
}

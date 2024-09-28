import { LocalDataStore } from '@/types/local-data-store'
import browser from 'webextension-polyfill'

export const get_auth_data = async (): Promise<{
  access_token: string
  refresh_token: string
  encryption_key: Array<number>
}> => {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(['auth_data']).then((result: LocalDataStore) => {
      if (result.auth_data) {
        resolve(result.auth_data)
      } else {
        reject()
      }
    })
  })
}

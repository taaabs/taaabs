import { LocalDataStore } from '@/types/local-data-store'
import browser from 'webextension-polyfill'

export const get_auth_data = async (): Promise<{
  access_token: string
  refresh_token: string
  encryption_key: Array<number>
}> => {
  return new Promise((resolve) => {
    browser.storage.local.get(['auth_data']).then((result: LocalDataStore) => {
      resolve(result.auth_data!)
    })
  })
}

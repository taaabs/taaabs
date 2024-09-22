import { LocalDataStore } from '@/types/local-data-store'
import { is_message } from '@/utils/is-message'
import browser from 'webextension-polyfill'

export const theme_changed = () => {
  browser.runtime.onMessage.addListener((request: any, _, __): any => {
    if (is_message(request) && request.action == 'theme-changed') {
      ;(async () => {
        if (
          request.theme &&
          ((await browser.storage.local.get('theme')) as LocalDataStore)
            ?.theme != request.theme
        ) {
          await browser.storage.local.set({ theme: request.theme })
          console.debug('Theme saved.', request.theme)
        } else {
          if (await browser.storage.local.get('theme')) {
            await browser.storage.local.remove('theme')
            console.debug('Theme removed.')
          }
        }
      })()
      return false
    }
    return false
  })
}

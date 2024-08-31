import { LocalDataStore } from '@/types/local-data-store'

export const theme_changed = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action == 'theme-changed') {
      ;(async () => {
        if (
          request.theme &&
          ((await chrome.storage.local.get('theme')) as LocalDataStore)
            ?.theme != request.theme
        ) {
          chrome.storage.local.set({ theme: request.theme }, () => {
            console.log('Theme saved.', request.theme)
          })
        } else {
          if (await chrome.storage.local.get('theme')) {
            chrome.storage.local.remove('theme', () => {
              console.log('Theme removed.')
            })
          }
        }
      })()
      return false
    }
    return false
  })
}

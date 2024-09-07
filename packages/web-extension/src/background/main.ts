import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { get_url_is_saved } from './get-url-is-saved'
import { update_icon } from './helpers/update-icon'
import { LocalDataStore } from '@/types/local-data-store'
import { message_listeners } from './message-listeners'

chrome.action.setBadgeBackgroundColor({ color: '#0DCA3B' })
chrome.action.setBadgeTextColor({ color: 'white' })

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get('auth_data', (data) => {
    if (!data.auth_data) {
      chrome.tabs.create({ url: 'https://taaabs.com/library' })
    } else {
      if (!tab.url?.startsWith('https://taaabs.com')) {
        chrome.tabs.sendMessage(tab.id!, { action: 'inject-popup' })
      }
    }
  })
})

message_listeners()

chrome.contextMenus.create({
  id: 'open_my_library',
  title: 'Open my library',
  contexts: ['page'],
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == 'open_my_library') {
    chrome.tabs.update(tab?.id!, { url: 'https://taaabs.com/library' })
  }
})

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pendingUrl == 'chrome://newtab/') {
    chrome.storage.local.get('use_custom_new_tab', (data) => {
      if (!data.use_custom_new_tab) {
        chrome.tabs.update(tab.id!, { url: 'chrome://new-tab-page' })
      }
    })
  }
})

/**
 * Responsibilities:
 *  - updating green tick (saved) indicator,
 *  - grabbing auth data of logged in user on taaabs.com,
 *  - grabbing theme if manually set
 */
const handle_tab_change = async (tab_id: number, url: string) => {
  if (url.startsWith('https://taaabs.com')) {
    update_icon(tab_id)
    // We need to wait for the page to load before we can read from local storage
    setTimeout(() => {
      chrome.tabs.sendMessage(
        tab_id,
        { action: 'get-auth-data' },
        async (auth_data) => {
          if (auth_data) {
            const parsed_auth_data = JSON.parse(auth_data)
            chrome.storage.local.set({ auth_data: parsed_auth_data }, () => {
              console.log(
                '[handle_tab_change] Auth data saved.',
                parsed_auth_data,
              )
            })
          } else {
            if (await chrome.storage.local.get('auth_data')) {
              chrome.storage.local.remove('auth_data', () => {
                console.log(
                  '[handle_tab_change] Old auth data has been deleted.',
                )
              })
            }
            console.log('[handle_tab_change] Auth data not found.')
          }
        },
      )
      chrome.tabs.sendMessage(
        tab_id,
        { action: 'get-theme' },
        async (response) => {
          if (response.theme) {
            if (
              ((await chrome.storage.local.get('theme')) as LocalDataStore)
                ?.theme != response.theme
            ) {
              chrome.storage.local.set({ theme: response.theme }, () => {
                console.log('[handle_tab_change] Theme saved.', response.theme)
              })
            }
          } else if (
            ((await chrome.storage.local.get('theme')) as LocalDataStore)?.theme
          ) {
            chrome.storage.local.remove('theme', () => {
              console.log('[handle_tab_change] Theme removed.')
            })
          }
        },
      )
    }, 1000)
  } else if (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://')
  ) {
    update_icon(tab_id)
  } else {
    const cleaned_url = url_cleaner(url)
    const is_saved = await get_url_is_saved(cleaned_url)
    update_icon(tab_id, is_saved)
  }
}

let is_handling_tab_change = false
let tab_change_queue = Promise.resolve()

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (is_handling_tab_change) return
  if (changeInfo.url) {
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'close-popup' })
      handle_tab_change(tabId, changeInfo.url)
    } catch (error) {
      console.error('Error handling tab update:', error)
    }
  }
})

// This listener is needed to handle refresh of the current tab
chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId == 0) {
    // Ensure it's the main frame
    tab_change_queue = tab_change_queue.then(async () => {
      is_handling_tab_change = true
      handle_tab_change(details.tabId, details.url)
      setTimeout(() => {
        is_handling_tab_change = false
      }, 500)
    })
  }
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ use_custom_new_tab: true })
  chrome.tabs.create({ url: 'https://taaabs.com/library' })
})

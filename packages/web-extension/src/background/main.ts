import ky from 'ky'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { get_is_url_saved } from './get-is-url-saved'
import { get_auth_data } from '@/helpers/get-auth-data'
import { update_icon } from './helpers/update-icon'

chrome.action.setBadgeBackgroundColor({ color: '#0DCA3B' })
chrome.action.setBadgeTextColor({ color: 'white' })

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url?.startsWith('https://taaabs.com')) {
    chrome.tabs.sendMessage(tab.id!, { action: 'inject-popup' })
  }
})

// For sendResponse to work, boolean must be returned synchronously
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action == 'check-url-saved') {
    ;(async () => {
      const [current_tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })
      const has_badge_text = !!(await chrome.action.getBadgeText({
        tabId: current_tab.id,
      }))
      sendResponse({ is_saved: has_badge_text })
    })()

    return true
  } else if (request.action == 'create-bookmark') {
    ;(async () => {
      const auth_data = await get_auth_data()
      const ky_instance = ky.create({
        prefixUrl: 'https://api.taaabs.com/',
        headers: {
          Authorization: `Bearer ${auth_data.access_token}`,
        },
      })

      const created_bookmark = await ky_instance
        .post('v1/bookmarks', {
          json: request.data,
        })
        .json()

      console.log('Bookmark has been created!', created_bookmark)

      sendResponse(created_bookmark)
    })()

    return true
  } else if (request.action == 'get-auth-data') {
    chrome.storage.local.get(['auth_data'], (result) => {
      sendResponse(result.auth_data)
      return true
    })
  } else if (request.action == 'theme-changed') {
    ;(async () => {
      if (
        request.theme &&
        (await chrome.storage.local.get('theme'))?.theme != request.theme
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
  } else if (request.action == 'open-options-page') {
    chrome.runtime.openOptionsPage()
  }
  return false
})

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
    chrome.storage.sync.get('use_custom_new_tab', (data) => {
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
              (await chrome.storage.local.get('theme'))?.theme != response.theme
            ) {
              chrome.storage.local.set({ theme: response.theme }, () => {
                console.log('[handle_tab_change] Theme saved.', response.theme)
              })
            }
          } else if ((await chrome.storage.local.get('theme'))?.theme) {
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
    const is_saved = await get_is_url_saved(cleaned_url)
    update_icon(tab_id, is_saved)
  }
}

let is_handling_tab_change = false

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    try {
      is_handling_tab_change = true
      await handle_tab_change(tabId, changeInfo.url)
      try {
        await chrome.tabs.sendMessage(tabId, { action: 'close-popup' })
      } catch {
        // No popup to close
      }
      setTimeout(() => {
        is_handling_tab_change = false
      }, 500)
    } catch (error) {
      console.error('Error handling tab update:', error)
    }
  }
})

// This listener is needed to handle refresh of the current tab
chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (is_handling_tab_change) return
  if (details.frameId == 0) {
    // Ensure it's the main frame
    try {
      await handle_tab_change(details.tabId, details.url)
    } catch (error) {
      console.error('Error handling web navigation commit:', error)
    }
  }
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ use_custom_new_tab: true })
  chrome.tabs.create({ url: 'https://taaabs.com/library' })
})

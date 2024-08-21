import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { get_is_url_saved } from './get-is-url-saved'

chrome.action.setBadgeBackgroundColor({ color: '#0DCA3B' })
chrome.action.setBadgeTextColor({ color: 'white' })

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == 'get_auth_data') {
    chrome.storage.local.get(['auth_data'], (result) => {
      sendResponse(result.auth_data)
    })
    return true // Keep the message channel open for sendResponse
  }
})

const update_icon = (tab_id: number, is_saved?: boolean) => {
  let icon_paths = {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  }

  chrome.action.setIcon({
    tabId: tab_id,
    path: icon_paths,
  })

  if (is_saved) {
    chrome.action.setBadgeText({
      tabId: tab_id,
      text: '✓',
    })
  } else {
    chrome.action.setBadgeText({
      tabId: tab_id,
      text: '',
    })
  }
}

/**
 * Responsibilities:
 *  - updating green tick (saved) indicator,
 *  - grabbing auth data of logged in user on taaabs.com,
 */
const handle_tab_change = async (tab_id: number, url: string) => {
  if (url.startsWith('https://taaabs.com')) {
    update_icon(tab_id)
    // We need to wait for the page to load before we can read from local storage
    setTimeout(() => {
      chrome.tabs.sendMessage(
        tab_id,
        { action: 'read_auth_data_at_taaabs_com' },
        (auth_data) => {
          if (auth_data) {
            const parsed_auth_data = JSON.parse(auth_data)
            chrome.storage.local.set({ auth_data: parsed_auth_data }, () => {
              console.log(
                '[handle_tab_change] Auth data saved.',
                parsed_auth_data,
              )
            })
          } else {
            console.log('[handle_tab_change] Auth data not found.')
          }
        },
      )
    }, 1000)
  } else if (url.startsWith('chrome://')) {
    update_icon(tab_id)
  } else {
    const cleaned_url = url_cleaner(url)
    const is_saved = await get_is_url_saved(cleaned_url)
    update_icon(tab_id, is_saved)
  }
}

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId == 0) {
    // Ensure it's the main frame
    try {
      await handle_tab_change(details.tabId, details.url)
    } catch (error) {
      console.error('Error handling web navigation commit:', error)
    }
  }
})
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    try {
      await handle_tab_change(tabId, changeInfo.url)
    } catch (error) {
      console.error('Error handling tab update:', error)
    }
  }
})

// Set an alarm to keep the service worker alive
chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 })

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name == 'keepAlive') {
    console.log('Service worker is alive.')
  }
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ use_custom_new_tab: true })
  chrome.tabs.create({ url: 'options.html' })
})
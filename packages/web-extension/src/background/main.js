import { setup_context_menus } from './setup_context_menus'
import { check_url_status } from './check_url_status'
import { update_icon } from './update_icon'

chrome.action.setBadgeBackgroundColor({ color: '#0DCA3B' })
chrome.action.setBadgeTextColor({ color: 'white' })

setup_context_menus()

async function handle_tab(tab_id, url) {
  if (url) {
    if (url.startsWith('https://taaabs.com')) {
      update_icon(tab_id)
      chrome.tabs.sendMessage(
        tab_id,
        { action: 'get_auth_data' },
        (auth_data) => {
          if (auth_data) {
            chrome.storage.local.set(
              { auth_data: JSON.parse(auth_data) },
              () => {
                console.log('Auth data saved:', auth_data)
              },
            )
          } else {
            console.log('Auth data not found.')
          }
        },
      )
    } else if (url.startsWith('chrome://')) {
      update_icon(tab_id)
    } else {
      const is_saved = await check_url_status(url)
      update_icon(tab_id, is_saved)
    }
  }
}

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId === 0) {
    // Ensure it's the main frame.
    try {
      await handle_tab(details.tabId, details.url)
    } catch (error) {
      console.error('Error handling web navigation commit:', error)
    }
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    try {
      await handle_tab(tabId, changeInfo.url)
    } catch (error) {
      console.error('Error handling tab update:', error)
    }
  }
})

// Set an alarm to keep the service worker alive.
chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 })

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name == 'keepAlive') {
    console.log('Service worker is alive.')
  }
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: 'https://taaabs.com/library' })
})
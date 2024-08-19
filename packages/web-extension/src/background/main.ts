import { setup_context_menus } from './setup-context-menus'
import { check_url_status } from './check-url-status'
import { update_icon } from './update-icon'
import { url_parser } from './utils/url_parser'

chrome.action.setBadgeBackgroundColor({ color: '#0DCA3B' })
chrome.action.setBadgeTextColor({ color: 'white' })

setup_context_menus()

async function handle_tab(tab_id: number, url?: string) {
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
      const parsed_url = url_parser(url)
      const is_saved = await check_url_status(parsed_url)
      update_icon(tab_id, is_saved)
    }
  }
}

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pendingUrl == 'chrome://newtab/') {
    chrome.storage.sync.get('useCustomNewTab', (data) => {
      if (!data.useCustomNewTab) {
        chrome.tabs.update(tab.id!, { url: 'chrome://new-tab-page' });
      }
    });
  }
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId == 0) {
    // Ensure it's the main frame
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

// Set an alarm to keep the service worker alive
chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 })

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name == 'keepAlive') {
    console.log('Service worker is alive.')
  }
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ useCustomNewTab: true })
  chrome.tabs.create({ url: 'options.html' })
})

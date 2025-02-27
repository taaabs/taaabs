import browser from 'webextension-polyfill'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { get_url_is_saved } from './get-url-is-saved'
import { update_icon } from './helpers/update-icon'
import { LocalDataStore } from '@/types/local-data-store'
import { message_listeners } from './message-listeners'
import { ensure_tab_is_ready } from './helpers/ensure-tab-is-ready'
import { get_auth_data } from '@/helpers/get-auth-data'

// Use browser.browserAction for Firefox, browser.action for Chrome
const action = browser.browserAction || browser.action
action.setBadgeBackgroundColor({ color: '#0DCA3B' })
action.setBadgeTextColor({ color: 'white' })

message_listeners()

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
    setTimeout(async () => {
      const auth_data = (await browser.tabs.sendMessage(tab_id, {
        action: 'get-auth-data',
      })) as any

      if (auth_data) {
        const parsed_auth_data = JSON.parse(auth_data)
        await browser.storage.local.set({ auth_data: parsed_auth_data })
        console.debug('[handle_tab_change] Auth data saved.', parsed_auth_data)
      } else {
        const oldData = await browser.storage.local.get('auth_data')
        if (oldData) {
          await browser.storage.local.remove('auth_data')
          console.debug('[handle_tab_change] Old auth data has been deleted.')
        }
        console.debug('[handle_tab_change] Auth data not found.')
      }

      const response = (await browser.tabs.sendMessage(tab_id, {
        action: 'get-theme',
      })) as any

      if (response.theme) {
        const data = (await browser.storage.local.get(
          'theme',
        )) as LocalDataStore
        if (data?.theme != response.theme) {
          await browser.storage.local.set({ theme: response.theme })
          console.debug('[handle_tab_change] Theme saved.', response.theme)
        }
      } else {
        const data = (await browser.storage.local.get(
          'theme',
        )) as LocalDataStore
        if (data?.theme) {
          await browser.storage.local.remove('theme')
          console.debug('[handle_tab_change] Theme removed.')
        }
      }
    }, 1000)

    await ensure_tab_is_ready(tab_id)
  } else if (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('moz-extension://')
  ) {
    update_icon(tab_id)
  } else {
    if (await get_auth_data()) {
      const cleaned_url = url_cleaner(url)
      const is_saved = await get_url_is_saved(cleaned_url)
      update_icon(tab_id, is_saved)
      await ensure_tab_is_ready(tab_id)
    }
  }
}

const updated_tab_ids = new Set()

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    // It throws error when Popup is not injected, we want to ignore that
    browser.tabs.sendMessage(tabId, { action: 'close-popup' }).catch(() => {})
    updated_tab_ids.add(tabId)
    setTimeout(() => {
      // Other option could be await handle tab change and not use this timeout
      // but on taaabs.com handle_tab_change runs instantly thus is not preventing
      // browser.webNavigation.onCommitted listener.
      updated_tab_ids.delete(tabId)
    }, 500)
    handle_tab_change(tabId, changeInfo.url)
  }
})

// This listener is needed to handle refresh of the current tab
browser.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId == 0 && !updated_tab_ids.has(details.tabId)) {
    // Ensure it's the main frame and the tab update event hasn't been triggered
    handle_tab_change(details.tabId, details.url)
  }
})

browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason == 'install') {
    browser.storage.local.set({
      custom_assistant_url: 'http://localhost:8080/',
    })
  }
})

// Keep alive in Chromium
if (!browser.browserAction) {
  const create_keep_alive_alarm = async () => {
    try {
      chrome.alarms.create('keep-alive', {
        when: Date.now() + 1000 * 60,
      }) // 1 minute interval
    } catch (error) {
      console.error('Error creating KeepAlive alarm:', error)
    }
  }

  chrome.runtime.onStartup.addListener(create_keep_alive_alarm)
  chrome.runtime.onInstalled.addListener(create_keep_alive_alarm)
  chrome.alarms.onAlarm.addListener(() => {
    create_keep_alive_alarm()
  })
}

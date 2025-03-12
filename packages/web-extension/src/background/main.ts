import browser from 'webextension-polyfill'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { get_url_is_saved } from './get-url-is-saved'
import { update_icon } from './helpers/update-icon'
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

    // Wait for the tab to be fully loaded before attempting to communicate
    await ensure_tab_is_ready(tab_id)

    try {
      const auth_data = (await browser.tabs.sendMessage(tab_id, {
        action: 'get-auth-data',
      })) as any

      if (auth_data) {
        const parsed_auth_data = JSON.parse(auth_data)
        await browser.storage.local.set({ auth_data: parsed_auth_data })
        console.debug('[handle_tab_change] Auth data saved.', parsed_auth_data)
      } else {
        const old_data = await browser.storage.local.get('auth_data')
        if (old_data) {
          await browser.storage.local.remove('auth_data')
          console.debug('[handle_tab_change] Old auth data has been deleted.')
        }
        console.debug('[handle_tab_change] Auth data not found.')
      }
    } catch (error) {
      console.debug('[handle_tab_change] Error communicating with tab:', error)
    }
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

browser.tabs.onUpdated.addListener((tab_id, change_info) => {
  if (change_info.url) {
    // It throws error when Popup is not injected, we want to ignore that
    browser.tabs.sendMessage(tab_id, { action: 'close-popup' }).catch(() => {})
    updated_tab_ids.add(tab_id)
    setTimeout(() => {
      updated_tab_ids.delete(tab_id)
    }, 500)
    handle_tab_change(tab_id, change_info.url)
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
        when: Date.now() + 1000 * 30,
      }) // 30 second interval
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

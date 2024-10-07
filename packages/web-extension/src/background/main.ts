import browser from 'webextension-polyfill'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'
import { get_url_is_saved } from './get-url-is-saved'
import { update_icon } from './helpers/update-icon'
import { LocalDataStore } from '@/types/local-data-store'
import { message_listeners } from './message-listeners'
import { ensure_tab_is_ready } from './helpers/ensure-tab-is-ready'
import { get_auth_data } from '@/helpers/get-auth-data'
import { various_values } from '@/constants/various_values'

// Use browser.browserAction for Firefox, browser.action for Chrome
const action = browser.browserAction || browser.action
action.setBadgeBackgroundColor({ color: '#0DCA3B' })
action.setBadgeTextColor({ color: 'white' })

action.onClicked.addListener(async (tab) => {
  if (
    tab.url?.startsWith('chrome://') ||
    tab.url?.startsWith('moz-extension://') ||
    tab.url == 'about:newtab'
  ) {
    await browser.tabs.update(tab.id!, { url: 'https://taaabs.com/library' })
  } else {
    await browser.tabs
      .sendMessage(tab.id!, { action: 'inject-popup' })
      .catch(() => {})
  }
})

message_listeners()

browser.contextMenus.create({
  id: 'capture-image',
  title: 'Ask with image',
  contexts: ['image'],
})

browser.contextMenus.create({
  id: 'capture-screenshot',
  title: 'Ask with image',
  contexts: ['page'],
})

// Chrome only
if (browser.action) {
  browser.contextMenus.create({
    id: 'capture-screenshot-action',
    title: 'Ask with image',
    contexts: ['action'],
  })
}

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId == 'capture-screenshot-action') {
    browser.tabs.sendMessage(tab?.id!, { action: 'close-popup' })
    const captured_image = await browser.tabs.captureVisibleTab()
    browser.tabs.sendMessage(tab?.id!, {
      action: 'captured-image',
      captured_image,
    })
    browser.tabs.sendMessage(tab?.id!, { action: 'inject-popup' })
  } else if (info.menuItemId == 'capture-screenshot') {
    const captured_image = await browser.tabs.captureVisibleTab()
    browser.tabs.sendMessage(tab?.id!, {
      action: 'captured-image',
      captured_image,
    })
    browser.tabs.sendMessage(tab?.id!, { action: 'inject-popup' })
  } else if (info.menuItemId == 'capture-image') {
    const image_url = info.srcUrl
    if (image_url) {
      try {
        const response = await fetch(image_url)
        if (!response.ok) {
          throw new Error(
            `Failed to fetch image: ${response.status} ${response.statusText}`,
          )
        }
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          const captured_image = reader.result
          browser.tabs.sendMessage(tab?.id!, {
            action: 'captured-image',
            captured_image,
          })
          browser.tabs.sendMessage(tab?.id!, { action: 'inject-popup' })
        }
        reader.readAsDataURL(blob)
      } catch (error) {
        console.error('Error converting image to base64:', error)
      }
    } else {
      console.error('Image URL is missing.')
    }
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
    await browser.tabs.sendMessage(tab_id, {
      action: 'url-saved-status',
      is_saved: false,
    })
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
      await browser.tabs.sendMessage(tab_id, {
        action: 'url-saved-status',
        is_saved,
      })
    }
  }
}

const updated_tab_ids = new Set()

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    // It throws error when Popup is not injected, we want to ignore that
    browser.tabs.sendMessage(tabId, { action: 'close-popup' }).catch(() => {})
    browser.tabs
      .sendMessage(tabId, { action: 'show-floating-button' })
      .catch(() => {})
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

browser.runtime.onInstalled.addListener(async () => {
  browser.storage.local.set({
    use_custom_new_tab: true,
    show_floating_button: true,
    local_assistant_port: various_values.local_assistant_default_port,
  })
  browser.runtime.openOptionsPage()
})

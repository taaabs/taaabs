import { setup_context_menus } from './context_menus'
import { check_url_status } from './url_checker'
import { update_icon } from './icon_manager'

chrome.runtime.onInstalled.addListener(setup_context_menus)

async function handle_tab(tab) {
  if (tab.url) {
    // get and set access token
    if (tab.url.startsWith('https://taaabs.com')) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
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
      })
    } else {
      const is_saved = await check_url_status(tab.url)
      update_icon(tab.id, is_saved)
    }
  }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId)
  handle_tab(tab)
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    handle_tab(tab)
  }
})

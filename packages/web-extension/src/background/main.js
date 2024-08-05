import { setup_context_menus } from './setup_context_menus'
import { check_url_status } from './check_url_status'
import { update_icon } from './update_icon'

chrome.runtime.onInstalled.addListener(setup_context_menus)

async function handle_tab(tab) {
  if (tab.url) {
    if (tab.url.startsWith('https://taaabs.com')) {
      update_icon(tab.id)
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
    } else if (tab.url.startsWith('chrome://')) {
      update_icon(tab.id)
    } else {
      const is_saved = await check_url_status(tab.url)
      update_icon(tab.id, is_saved)
    }
  }
}

chrome.tabs.onUpdated.addListener(async (_, change_info, tab) => {
  if (change_info.status == 'complete') {
    try {
      handle_tab(tab)
    } catch (error) {
      console.error('Error handling tab:', error)
    }
  }
})

import browser from 'webextension-polyfill'

// Use browser.browserAction for Firefox, browser.action for Chrome
const action = browser.browserAction || browser.action

export const update_icon = async (tab_id: number, is_saved?: boolean) => {
  let icon_paths = {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  }

  await action.setIcon({
    tabId: tab_id,
    path: icon_paths,
  })

  if (is_saved) {
    await action.setBadgeText({
      tabId: tab_id,
      text: '✓',
    })
  } else {
    await action.setBadgeText({
      tabId: tab_id,
      text: '',
    })
  }
}

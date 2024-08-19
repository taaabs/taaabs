export function update_icon(tab_id: number, is_saved?: boolean) {
  let icon_paths = {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  };

  chrome.action.setIcon({
    tabId: tab_id,
    path: icon_paths,
  });

  if (is_saved) {
    chrome.action.setBadgeText({
      tabId: tab_id,
      text: '✓',
    });
  } else {
    chrome.action.setBadgeText({
      tabId: tab_id,
      text: '',
    });
  }
}
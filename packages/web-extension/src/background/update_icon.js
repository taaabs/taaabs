export function update_icon(tab_id, is_saved) {
  let icon_paths
  if (is_saved === undefined) {
    icon_paths = {
      16: 'icons/icon16.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    }
  } else {
    icon_paths = is_saved
      ? {
          16: 'icons/icon16-saved.png',
          48: 'icons/icon48-saved.png',
          128: 'icons/icon128-saved.png',
        }
      : {
          16: 'icons/icon16-save.png',
          48: 'icons/icon48-save.png',
          128: 'icons/icon128-save.png',
        }
  }

  chrome.action.setIcon({
    tabId: tab_id,
    path: icon_paths,
  })
}

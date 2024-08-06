export function update_icon(tab_id, is_saved) {
  let icon_paths = is_saved
    ? {
        16: 'icons/icon16-saved.png',
        48: 'icons/icon48-saved.png',
        128: 'icons/icon128-saved.png',
      }
    : {
        16: 'icons/icon16.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png',
      }

  chrome.action.setIcon({
    tabId: tab_id,
    path: icon_paths,
  })
}

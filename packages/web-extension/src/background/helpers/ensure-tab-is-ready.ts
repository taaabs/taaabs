export const ensure_tab_is_ready = (tab_id: number): Promise<void> => {
  return new Promise((resolve) => {
    const check_tab = () => {
      chrome.tabs.get(tab_id, (tab) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError)
          resolve() // Resolve anyway to prevent hanging
          return
        }

        if (tab.status == 'complete') {
          resolve()
        } else {
          setTimeout(check_tab, 100) // Check again after 100ms
        }
      })
    }

    check_tab()
  })
}

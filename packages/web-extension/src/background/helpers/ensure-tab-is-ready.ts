import browser from 'webextension-polyfill'

export const ensure_tab_is_ready = (tab_id: number): Promise<void> => {
  return new Promise((resolve) => {
    const check_tab = () => {
      browser.tabs
        .get(tab_id)
        .then((tab) => {
          if (tab.status == 'complete') {
            resolve()
          } else {
            setTimeout(check_tab, 100) // Check again after 100ms
          }
        })
        .catch((error) => {
          console.error(error)
          resolve() // Resolve anyway to prevent hanging
        })
    }

    check_tab()
  })
}

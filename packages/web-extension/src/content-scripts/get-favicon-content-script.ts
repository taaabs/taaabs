import browser from 'webextension-polyfill'
import localForage from 'localforage'

// listen to message on window object requesting favicon for a specific domain
window.addEventListener('message', async (event) => {
  if (
    event.source === window &&
    event.data &&
    event.data.action == 'get-favicon'
  ) {
    const domain = event.data.domain
    localForage.getItem(`favicon:${domain}`).then((favicon) => {
      if (favicon == null) {
        browser.runtime
          .sendMessage({ action: 'get-favicon', domain })
          .then((response: any) => {
            const favicon = response.favicon
            if (favicon) {
              const binary = atob(favicon.split(',')[1])
              const array = []
              for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i))
              }
              const uint8Array = new Uint8Array(array)
              const blob = new Blob([uint8Array], { type: 'image/webp' })
              const reader = new FileReader()
              reader.onloadend = function () {
                const favicon = reader.result
                localForage.setItem(`favicon:${domain}`, favicon)
                window.postMessage({ action: 'favicon', domain, favicon }, '*')
              }
              reader.readAsDataURL(blob)
            } else {
              localForage.setItem(`favicon:${domain}`, '')
            }
          })
      } else {
        window.postMessage({ action: 'favicon', domain, favicon }, '*')
      }
    })
  }
})

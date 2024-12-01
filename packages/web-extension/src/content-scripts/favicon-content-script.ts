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
    localForage.getItem(`Favicon ${domain}`).then((favicon) => {
      if (favicon == null) {
        browser.runtime
          .sendMessage({ action: 'get-favicon', domain })
          .then((response: any) => {
            console.log(response)
            if (response) {
              // Convert the received data to base64 encoded avif
              const binary = atob(response.favicon.split(',')[1])
              const array = []
              for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i))
              }
              const uint8Array = new Uint8Array(array)
              const blob = new Blob([uint8Array], { type: 'image/avif' })
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
        window.postMessage({ action: 'favicon', favicon, domain }, '*')
      }
    })
  }
})

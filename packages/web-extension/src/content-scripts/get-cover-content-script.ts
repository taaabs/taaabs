import browser from 'webextension-polyfill'
import localForage from 'localforage'

window.addEventListener('message', async (event) => {
  if (
    event.source === window &&
    event.data &&
    event.data.action == 'get-cover'
  ) {
    const url = event.data.url
    localForage.getItem(`cover:${url}`).then((cover) => {
      if (cover == null) {
        browser.runtime
          .sendMessage({ action: 'get-cover', url })
          .then((response: any) => {
            const cover = response.cover
            if (cover) {
              const binary = atob(cover.split(',')[1])
              const array = []
              for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i))
              }
              const uint8Array = new Uint8Array(array)
              const blob = new Blob([uint8Array], { type: 'image/webp' })
              const reader = new FileReader()
              reader.onloadend = function () {
                const cover = reader.result
                localForage.setItem(`cover:${url}`, cover)
                window.postMessage({ action: 'cover', url, cover }, '*')
              }
              reader.readAsDataURL(blob)
            } else {
              localForage.setItem(`cover:${url}`, '')
            }
          })
      } else {
        window.postMessage({ action: 'cover', url, cover }, '*')
      }
    })
  }
})

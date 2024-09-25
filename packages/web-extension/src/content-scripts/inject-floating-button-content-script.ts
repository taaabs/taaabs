import browser from 'webextension-polyfill'
import { is_message } from '@/utils/is-message'

const update_button_status = (isSaved: boolean) => {
  document.querySelector<HTMLElement>(
    '#taaabs .saved-indicator',
  )!.style.opacity = isSaved ? '1' : '0'
}

const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = browser.runtime.getURL('floating-button.css')
document.head.appendChild(link)

browser.storage.local
  .get('show_floating_button')
  .then(({ show_floating_button }) => {
    if (show_floating_button) {
      // Inject the floating button only if the option is enabled
      fetch(browser.runtime.getURL('floating-button.html'))
        .then((response) => response.text())
        .then((html) => {
          //Remove existing button before adding a new one to avoid duplicates.
          document
            .querySelector<HTMLElement>('#taaabs.floating-button')
            ?.remove()
          document.body.insertAdjacentHTML('beforeend', html)
          const button = document.querySelector<HTMLElement>(
            '#taaabs.floating-button',
          )
          button!.addEventListener('click', () => {
            browser.runtime.sendMessage({ action: 'open-popup' })
          })
          document.addEventListener('fullscreenchange', () => {
            if (!button) return
            if (document.fullscreenElement) {
              button.style.display = 'none'
            } else {
              button.style.display = 'block'
            }
          })
        })
        .catch((error) =>
          console.error('Error injecting floating button HTML:', error),
        )
    }
  })
  .catch((error) => console.error('Error accessing storage:', error))

browser.runtime.onMessage.addListener((message: any, _, __): any => {
  if (is_message(message) && message.action == 'url-saved-status') {
    update_button_status(message.is_saved)
  } else if (is_message(message) && message.action == 'bookmark-created') {
    update_button_status(true)
  } else if (is_message(message) && message.action == 'bookmark-deleted') {
    update_button_status(false)
  } else if (is_message(message) && message.action == 'popup-opened') {
    document.querySelector<HTMLElement>(
      '#taaabs.floating-button',
    )!.style.transform = 'translateX(100%)'
    window.postMessage({ action: 'popup-opened' }, '*')
  } else if (is_message(message) && message.action == 'popup-closed') {
    document.querySelector<HTMLElement>(
      '#taaabs.floating-button',
    )!.style.transform = ''
    window.postMessage({ action: 'popup-closed' }, '*')
  }
})

// src/content-scripts/inject-floating-button-content-script.ts

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
  .get(['show_floating_button', 'floating_button_top'])
  .then(({ show_floating_button, floating_button_top }) => {
    if (show_floating_button) {
      fetch(browser.runtime.getURL('floating-button.html'))
        .then((response) => response.text())
        .then((html) => {
          // Remove existing button to avoid duplicates
          document
            .querySelector<HTMLElement>('#taaabs.floating-button')
            ?.remove()
          document.body.insertAdjacentHTML('beforeend', html)
          const button = document.querySelector<HTMLElement>(
            '#taaabs.floating-button',
          )!

          if (floating_button_top) {
            button!.style.top = floating_button_top + 'px'
          }

          let is_drag_mode_enabled = false
          let was_mouse_moved_while_dragging: boolean
          let offset_y: number

          button.addEventListener('mousedown', (e) => {
            is_drag_mode_enabled = true
            offset_y = e.clientY - button!.offsetTop
            button!.style.cursor = 'grabbing'
            document.body.style.userSelect = 'none'
          })

          document.addEventListener('mousemove', (e) => {
            if (is_drag_mode_enabled) {
              was_mouse_moved_while_dragging = true
              const new_top = e.clientY - offset_y
              if (new_top >= 100 && new_top <= 400) {
                button!.style.top = new_top + 'px'
                browser.storage.local.set({ floating_button_top: new_top })
              }
            }
          })

          document.addEventListener('mouseup', () => {
            if (is_drag_mode_enabled && !was_mouse_moved_while_dragging) {
              browser.runtime.sendMessage({ action: 'open-popup' })
            }
            is_drag_mode_enabled = false
            was_mouse_moved_while_dragging = false
            button!.style.cursor = ''
            document.body.style.userSelect = ''
          })

          document.addEventListener('fullscreenchange', () => {
            if (!button) return
            if (document.fullscreenElement) {
              button.style.display = 'none'
            } else {
              button.style.display = 'block'
            }
          })

          browser.runtime.onMessage.addListener((message: any, _, __): any => {
            if (is_message(message) && message.action == 'url-saved-status') {
              update_button_status(message.is_saved)
            } else if (
              is_message(message) &&
              message.action == 'bookmark-created'
            ) {
              update_button_status(true)
            } else if (
              is_message(message) &&
              message.action == 'bookmark-deleted'
            ) {
              update_button_status(false)
            } else if (
              is_message(message) &&
              message.action == 'popup-opened'
            ) {
              button!.style.transform = 'translateX(100%)'
              window.postMessage({ action: 'popup-opened' }, '*')
            } else if (
              is_message(message) &&
              message.action == 'popup-closed'
            ) {
              button!.style.transform = ''
              window.postMessage({ action: 'popup-closed' }, '*')
            } else if (
              is_message(message) &&
              message.action == 'show-floating-button'
            ) {
              button!.style.transform = '' // Ensure button is visible when message is received
            }
          })
        })
        .catch((error) =>
          console.error('Error injecting floating button HTML:', error),
        )
    }
  })
  .catch((error) => console.error('Error accessing storage:', error))

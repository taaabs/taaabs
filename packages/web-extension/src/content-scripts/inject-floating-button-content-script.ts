const update_button_status = (isSaved: boolean) => {
  document.querySelector<HTMLElement>(
    '#taaabs .saved-indicator',
  )!.style.opacity = isSaved ? '1' : '0'
}

const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = chrome.runtime.getURL('floating-button.css')
document.head.appendChild(link)

chrome.runtime.onMessage.addListener((message, _, __) => {
  if (message.action == 'url-saved-status') {
    fetch(chrome.runtime.getURL('floating-button.html'))
      .then((response) => response.text())
      .then((html) => {
        // Element will be there on SPA app navigation
        document.querySelector<HTMLElement>('#taaabs.floating-button')?.remove()
        document.body.insertAdjacentHTML('beforeend', html)
        update_button_status(message.is_saved)
        const button = document.querySelector<HTMLElement>(
          '#taaabs.floating-button',
        )
        button!.addEventListener('click', () => {
          chrome.runtime.sendMessage({ action: 'open-popup' })
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
  } else if (message.action == 'bookmark-created') {
    update_button_status(true)
  } else if (message.action == 'bookmark-deleted') {
    update_button_status(false)
  } else if (message.action == 'popup-opened') {
    document.querySelector<HTMLElement>(
      '#taaabs.floating-button',
    )!.style.transform = 'translateX(100%)'
  } else if (message.action == 'popup-closed') {
    document.querySelector<HTMLElement>(
      '#taaabs.floating-button',
    )!.style.transform = ''
  }
})

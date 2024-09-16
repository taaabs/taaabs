const button = document.createElement('div')
button.id = 'taaabs-floating-button'
button.innerHTML = '🔖'
button.style.cssText = `
    position: fixed;
    top: 100px;
    right: 0;
    width: 50px;
    height: 50px;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 9999999;
  `

button.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'open-popup' })
})

const update_button_status = (isSaved: boolean) => {
  button.style.opacity = '1'
  button.style.backgroundColor = isSaved ? '#0DCA3B' : '#808080'
}

chrome.runtime.onMessage.addListener((message, _, __) => {
  if (message.action == 'url-saved-status') {
    // Wait for the DOM
    const append_child = () => {
      document.body.appendChild(button)
      update_button_status(message.is_saved)
    }
    try {
      append_child()
    } catch {
      setTimeout(() => {
        append_child()
      }, 10)
    }
  } else if (message.action == 'bookmark-created') {
    update_button_status(true)
  } else if (message.action == 'bookmark-deleted') {
    update_button_status(false)
  }
})

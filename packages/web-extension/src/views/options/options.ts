import browser from 'webextension-polyfill'

// Event listeners for checkboxes and input field
document
  .getElementById('open-assistant-in-new-tab')!
  .addEventListener('change', (event: Event) => {
    browser.storage.local.set({
      open_chatbot_in_new_tab: (event.target as HTMLInputElement).checked,
    })
  })

document
  .getElementById('local-assistant-url')!
  .addEventListener('input', (event: Event) => {
    const local_assistant_url = (event.target as HTMLInputElement).value
    browser.storage.local.set({ local_assistant_url })
  })

const logout_button = document.getElementById('logout-button')
logout_button?.addEventListener('click', async () => {
  await browser.storage.local.remove('auth_data')
  logout_button.style.display = 'none'
  browser.runtime.sendMessage({ action: 'logout' })
})

// Retrieve and set initial states from storage
browser.storage.local
  .get([
    'open_chatbot_in_new_tab',
    'local_assistant_url',
    'auth_data',
  ])
  .then((data: any) => {
    ;(
      document.getElementById('open-assistant-in-new-tab') as HTMLInputElement
    ).checked = data.open_chatbot_in_new_tab || false
    ;(
      document.getElementById('local-assistant-url') as HTMLInputElement
    ).value = data.local_assistant_url
    logout_button!.style.display = !data.auth_data ? 'none' : ''
  })

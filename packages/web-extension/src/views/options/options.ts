import browser from 'webextension-polyfill'

// Detect Firefox
if (/firefox/i.test(navigator.userAgent)) {
  // Remove the "Use custom new tab page" option
  document.getElementById('use-custom-new-tab-option')!.style.display = 'none'
}

// Event listeners for checkboxes and input field
document
  .getElementById('use-custom-new-tab')!
  .addEventListener('change', (event: Event) => {
    browser.storage.local.set({
      use_custom_new_tab: (event.target as HTMLInputElement).checked,
    })
  })

document
  .getElementById('open-chatbot-in-new-tab')!
  .addEventListener('change', (event: Event) => {
    browser.storage.local.set({
      open_chatbot_in_new_tab: (event.target as HTMLInputElement).checked,
    })
  })

document
  .getElementById('custom-chatbot-url')!
  .addEventListener('input', (event: Event) => {
    const custom_chatbot_url = (
      event.target as HTMLInputElement
    ).value.endsWith('/')
      ? (event.target as HTMLInputElement).value
      : (event.target as HTMLInputElement).value + '/'
    browser.storage.local.set({ custom_chatbot_url })
  })

document
  .getElementById('show-floating-button')!
  .addEventListener('change', (event: Event) => {
    browser.storage.local.set({
      show_floating_button: (event.target as HTMLInputElement).checked,
    })
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
    'use_custom_new_tab',
    'open_chatbot_in_new_tab',
    'custom_chatbot_url',
    'show_floating_button',
    'auth_data',
  ])
  .then((data: any) => {
    ;(
      document.getElementById('use-custom-new-tab') as HTMLInputElement
    ).checked = data.use_custom_new_tab || false
    ;(
      document.getElementById('open-chatbot-in-new-tab') as HTMLInputElement
    ).checked = data.open_chatbot_in_new_tab || false
    ;(document.getElementById('custom-chatbot-url') as HTMLInputElement).value =
      data.custom_chatbot_url || ''
    ;(
      document.getElementById('show-floating-button') as HTMLInputElement
    ).checked = data.show_floating_button || false
    logout_button!.style.display = !data.auth_data ? 'none' : ''
  })

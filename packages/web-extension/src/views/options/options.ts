import browser from 'webextension-polyfill'

document
  .getElementById('open-assistant-in-new-tab')!
  .addEventListener('change', (event: Event) => {
    browser.storage.local.set({
      open_chatbot_in_new_tab: (event.target as HTMLInputElement).checked,
    })
  })

// Hide the checkbox if the device is a touch screen,
// required by Firefox mobile extension to work.
const is_touch_screen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
if (is_touch_screen) {
  document.getElementById('open-assistant-in-new-tab-row')!.style.display =
    'none'
}

// Function to ensure URL has trailing slash if no pathname is set
const ensure_trailing_slash = (url: string): string => {
  try {
    const url_obj = new URL(url)
    if (!url_obj.pathname || url_obj.pathname === '/') {
      url_obj.pathname = '/'
      return url_obj.toString()
    }
    return url
  } catch (e) {
    // Return original string if URL is invalid
    return url
  }
}

const custom_assistant_url_input = document.getElementById(
  'custom-assistant-url',
) as HTMLInputElement

document
  .getElementById('save-custom-url')!
  .addEventListener('click', async () => {
    const custom_assistant_url = ensure_trailing_slash(
      custom_assistant_url_input.value,
    )
    await browser.storage.local.set({ custom_assistant_url })
    custom_assistant_url_input.value = custom_assistant_url // Update input with potentially modified URL
  })

const logout_button = document.getElementById('logout-button')
logout_button?.addEventListener('click', async () => {
  await browser.storage.local.remove('auth_data')
  logout_button.style.display = 'none'
  browser.runtime.sendMessage({ action: 'logout' })
})

const reset_history_button = document.getElementById('reset-history-button')
reset_history_button?.addEventListener('click', async () => {
  const user_confirmed = confirm(
    'Are you sure you want to reset your recent prompts history? This action cannot be undone.',
  )

  if (user_confirmed) {
    await browser.storage.local.remove('prompts_history')
    await browser.storage.local.remove('prompts_vision_history')
    alert('Recent prompts history has been reset!')
  }
})

// Retrieve and set initial states from storage
browser.storage.local
  .get(['open_chatbot_in_new_tab', 'custom_assistant_url', 'auth_data'])
  .then((data: any) => {
    ;(
      document.getElementById('open-assistant-in-new-tab') as HTMLInputElement
    ).checked = data.open_chatbot_in_new_tab || false
    custom_assistant_url_input.value = data.custom_assistant_url || ''
    logout_button!.style.display = !data.auth_data ? 'none' : ''
  })

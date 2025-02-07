import browser from 'webextension-polyfill'
import { AssistantName } from '../../constants/assistants'

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

document
  .getElementById('custom-assistant-url')!
  .addEventListener('input', (event: Event) => {
    const custom_assistant_url = (event.target as HTMLInputElement).value
    browser.storage.local.set({ custom_assistant_url })
  })

const logout_button = document.getElementById('logout-button')
logout_button?.addEventListener('click', async () => {
  await browser.storage.local.remove('auth_data')
  logout_button.style.display = 'none'
  browser.runtime.sendMessage({ action: 'logout' })
})

const clear_history_button = document.getElementById('clear-history-button')
clear_history_button?.addEventListener('click', async () => {
  const user_confirmed = confirm(
    'Are you sure you want to clear your recent prompts history? This action cannot be undone.',
  )

  if (user_confirmed) {
    await browser.storage.local.remove('prompts_history')
    await browser.storage.local.remove('prompts_vision_history')
    alert('Recent prompts history cleared!')
  }
})

const defaultAssistantSelect = document.getElementById(
  'default-assistant',
) as HTMLSelectElement
const defaultVisionAssistantSelect = document.getElementById(
  'default-vision-assistant',
) as HTMLSelectElement

defaultAssistantSelect.addEventListener('change', () => {
  const selectedAssistant = defaultAssistantSelect.value as AssistantName
  browser.storage.local.set({ last_used_chatbot_name: selectedAssistant })
})

defaultVisionAssistantSelect.addEventListener('change', () => {
  const selectedAssistant = defaultVisionAssistantSelect.value as AssistantName
  browser.storage.local.set({
    last_used_chatbot_vision_name: selectedAssistant,
  })
})

// Retrieve and set initial states from storage
browser.storage.local
  .get([
    'open_chatbot_in_new_tab',
    'custom_assistant_url',
    'auth_data',
    'last_used_chatbot_name',
    'last_used_chatbot_vision_name',
  ])
  .then((data: any) => {
    ;(
      document.getElementById('open-assistant-in-new-tab') as HTMLInputElement
    ).checked = data.open_chatbot_in_new_tab || false
    ;(
      document.getElementById('custom-assistant-url') as HTMLInputElement
    ).value = data.custom_assistant_url
    logout_button!.style.display = !data.auth_data ? 'none' : ''
    defaultAssistantSelect.value = data.last_used_chatbot_name || 'chatgpt'
    defaultVisionAssistantSelect.value =
      data.last_used_chatbot_vision_name || 'copilot'
  })

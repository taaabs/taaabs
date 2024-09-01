document
  .getElementById('use_custom_new_tab')
  .addEventListener('change', function (event) {
    chrome.storage.local.set({ use_custom_new_tab: event.target.checked })
  })

document
  .getElementById('open_chatbot_in_new_tab')
  .addEventListener('change', function (event) {
    chrome.storage.local.set({ open_chatbot_in_new_tab: event.target.checked })
  })

document
  .getElementById('custom_chatbot_url')
  .addEventListener('input', function (event) {
    // Trailing slash is required by manifest to properly 
    // detect matching url and inject content script
    const custom_chatbot_url = event.target.value.endsWith('/')
      ? event.target.value
      : event.target.value + '/'
    chrome.storage.local.set({ custom_chatbot_url })
  })

chrome.storage.local.get('use_custom_new_tab', function (data) {
  document.getElementById('use_custom_new_tab').checked =
    data.use_custom_new_tab || false
})

chrome.storage.local.get('open_chatbot_in_new_tab', function (data) {
  document.getElementById('open_chatbot_in_new_tab').checked =
    data.open_chatbot_in_new_tab || false
})

chrome.storage.local.get('custom_chatbot_url', function (data) {
  document.getElementById('custom_chatbot_url').value =
    data.custom_chatbot_url || ''
})

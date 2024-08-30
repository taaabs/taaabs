document
  .getElementById('use_custom_new_tab')
  .addEventListener('change', function (event) {
    chrome.storage.sync.set({ use_custom_new_tab: event.target.checked })
  })

document
  .getElementById('open_chatbot_in_new_tab')
  .addEventListener('change', function (event) {
    chrome.storage.sync.set({ open_chatbot_in_new_tab: event.target.checked })
  })

chrome.storage.sync.get('use_custom_new_tab', function (data) {
  document.getElementById('use_custom_new_tab').checked =
    data.use_custom_new_tab || false
})

chrome.storage.sync.get('open_chatbot_in_new_tab', function (data) {
  document.getElementById('open_chatbot_in_new_tab').checked =
    data.open_chatbot_in_new_tab || false
})

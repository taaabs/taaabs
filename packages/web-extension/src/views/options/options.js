// Event listeners for checkboxes and input field
document
  .getElementById('use_custom_new_tab')
  .addEventListener('change', function (event) {
    chrome.storage.local.set({ use_custom_new_tab: event.target.checked });
  });

document
  .getElementById('open_chatbot_in_new_tab')
  .addEventListener('change', function (event) {
    chrome.storage.local.set({ open_chatbot_in_new_tab: event.target.checked });
  });

document
  .getElementById('custom_chatbot_url')
  .addEventListener('input', function (event) {
    const custom_chatbot_url = event.target.value.endsWith('/')
      ? event.target.value
      : event.target.value + '/';
    chrome.storage.local.set({ custom_chatbot_url });
  });

// Chatbot window position radio buttons
const chatbot_position_radios = document.querySelectorAll(
  'input[name="chatbot_position"]'
);
chatbot_position_radios.forEach((radio) => {
  radio.addEventListener('change', function (event) {
    chrome.storage.local.set({ chatbot_window_position: event.target.value });
  });
});

// Retrieve and set initial states from local storage
chrome.storage.local.get(
  [
    'use_custom_new_tab',
    'open_chatbot_in_new_tab',
    'custom_chatbot_url',
    'chatbot_window_position',
  ],
  function (data) {
    document.getElementById('use_custom_new_tab').checked =
      data.use_custom_new_tab || false;
    document.getElementById('open_chatbot_in_new_tab').checked =
      data.open_chatbot_in_new_tab || false;
    document.getElementById('custom_chatbot_url').value =
      data.custom_chatbot_url || '';
    const position = data.chatbot_window_position || 'middle';
    document.getElementById(`chatbot_position_${position}`).checked = true;
  }
);
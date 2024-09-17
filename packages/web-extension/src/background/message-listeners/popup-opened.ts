export const popup_opened = () => {
  chrome.runtime.onMessage.addListener((message: any, _, __) => {
    if (message.action == 'popup-opened') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, message)
        }
      })
    }
  })
}

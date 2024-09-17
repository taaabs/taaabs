export const popup_closed = () => {
  chrome.runtime.onMessage.addListener((message: any, _, __) => {
    if (message.action == 'popup-closed') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, message)
        }
      })
    }
  })
}

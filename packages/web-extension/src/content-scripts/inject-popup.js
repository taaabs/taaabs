chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == 'inject_popup') {
    injectPopup()
  }
})

const injectPopup = () => {
  const popupHtml = chrome.runtime.getURL('popup-injected.html')
  fetch(popupHtml)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.text()
    })
    .then((data) => {
      const container = document.createElement('div')
      container.id = 'injected-popup-container'
      container.style.display = 'block' // Show the popup immediately
      container.innerHTML = data
      document.body.appendChild(container)

      // Dynamically inject the script tag
      const script = document.createElement('script')
      script.src = chrome.runtime.getURL('popup-injected.bundle.js')
      document.body.appendChild(script)

      window.addEventListener('message', event => {
        if (event.source !== window) return;
        if (event.data && event.data.from === 'preactApp') {
          // Forward the message to the background script
          chrome.runtime.sendMessage(event.data, response => {
            // Send the response back to the Preact app
            window.postMessage({ from: 'contentScript', response }, '*');
          });
        }
      });
    })
    .catch((error) => {
      console.error('Failed to fetch popup-injected.html:', error)
    })
}

document
  .getElementById('useCustomNewTab')
  .addEventListener('change', function (event) {
    chrome.storage.sync.set({ useCustomNewTab: event.target.checked })
  })

chrome.storage.sync.get('useCustomNewTab', function (data) {
  document.getElementById('useCustomNewTab').checked =
    data.useCustomNewTab || false
})

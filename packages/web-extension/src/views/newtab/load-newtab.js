window.onload = function () {
  var script = document.createElement('script')
  script.src = 'newtab.js'
  // Timeout prevents white flash on dark theme
  setTimeout(() => {
    document.body.appendChild(script)
  }, 150)
}

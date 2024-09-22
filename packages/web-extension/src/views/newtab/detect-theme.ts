import browser from 'webextension-polyfill'

function detect_system_theme() {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
  if (darkThemeMq.matches) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

// Check storage for theme preference and apply it
browser.storage.local.get('theme').then((data: any) => {
  if (data.theme) {
    document.documentElement.setAttribute('data-theme', data.theme)
  } else {
    detect_system_theme()
  }
})

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', detect_system_theme)

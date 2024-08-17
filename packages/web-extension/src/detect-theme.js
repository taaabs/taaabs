function detectSystemTheme() {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
  if (darkThemeMq.matches) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

detectSystemTheme()

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', detectSystemTheme)

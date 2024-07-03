function set_theme(newTheme) {
  window.__theme = newTheme
  if (newTheme == 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.setAttribute('data-theme-set-by', 'user')
  } else if (newTheme == 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.setAttribute('data-theme-set-by', 'user')
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.setAttribute('data-theme-set-by', 'system')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.setAttribute('data-theme-set-by', 'system')
  }
  document.documentElement.classList.add('no-transitions')
  setTimeout(() => {
    document.documentElement.classList.remove('no-transitions')
  }, 0)
}

var preferred_theme = localStorage.getItem('theme')

window.__set_preferred_theme = function (new_theme) {
  preferred_theme = new_theme
  set_theme(new_theme)
  if (new_theme) {
    localStorage.setItem('theme', new_theme)
  } else {
    localStorage.removeItem('theme')
  }
}

var initial_theme = preferred_theme
var dark_query = window.matchMedia('(prefers-color-scheme: dark)')

set_theme(initial_theme)

dark_query.addEventListener('change', function (e) {
  if (!preferred_theme) {
    set_theme()
  }
})

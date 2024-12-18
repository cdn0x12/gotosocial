(function() {
  if (typeof window === 'undefined') return;

  function getThemePreference() {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      return storedTheme
    }
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  }

  function applyTheme(theme) {
    const html = document.documentElement
    
    if (theme === 'dark') {
      html.classList.add('is-dark')
      html.classList.remove('is-light') 
    } else if (theme === 'light') {
      html.classList.add('is-light')
      html.classList.remove('is-dark')
    } else {
      html.classList.remove('is-dark', 'is-light')
    }
    
    localStorage.setItem('theme', theme)
  }

  function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'auto'
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
    applyTheme(nextTheme)
    updateThemeButton(nextTheme)
  }

  function updateThemeButton(theme) {
    const button = document.getElementById('theme-toggle')
    if (!button) return
    
    button.innerHTML = theme === 'dark' ? '🌙' : '☀️'
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`)
  }

  const theme = localStorage.getItem('theme')
  if (theme === 'light') {
    document.documentElement.classList.add('is-light')
  } else if (theme === 'dark') {
    document.documentElement.classList.add('is-dark')
  }

  function initTheme() {
    const theme = getThemePreference()
    applyTheme(theme)
    updateThemeButton(theme)
    
    const themeToggle = document.getElementById('theme-toggle')
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme)
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('theme') === 'auto') {
        applyTheme(e.matches ? 'dark' : 'light')
        updateThemeButton(e.matches ? 'dark' : 'light')
      }
    })
  }

  window.toggleTheme = toggleTheme

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme)
  } else {
    initTheme()
  }
})();
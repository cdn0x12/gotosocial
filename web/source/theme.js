(function() {
  if (typeof window === 'undefined') return;

  function getThemePreference() {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      return storedTheme
    }
    
    return 'auto'
  }

  function applyTheme(theme) {
    const html = document.documentElement
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      html.classList.toggle('is-dark', prefersDark)
      html.classList.toggle('is-light', !prefersDark)
    } else {
      html.classList.toggle('is-dark', theme === 'dark')
      html.classList.toggle('is-light', theme === 'light')
    }
    
    localStorage.setItem('theme', theme)
  }

  function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'auto'
    const themeOrder = ['light', 'dark', 'auto']
    const currentIndex = themeOrder.indexOf(currentTheme)
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length]
    
    applyTheme(nextTheme)
    updateThemeButton(nextTheme)
  }

  function updateThemeButton(theme) {
    const button = document.getElementById('theme-toggle')
    if (!button) return
    
    const icons = {
      light: '☀️',
      dark: '🌙',
      auto: '🌓'
    }
    
    button.innerHTML = icons[theme]
    button.setAttribute('aria-label', `Switch to ${
      theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto'
    } theme`)
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
        const isLight = !e.matches
        html.classList.toggle('is-light', isLight)
        html.classList.toggle('is-dark', !isLight)
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
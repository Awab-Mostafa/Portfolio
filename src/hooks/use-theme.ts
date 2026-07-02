import { useEffect, useState } from "react"

type Theme = "light" | "dark"

const THEME_STORAGE_KEY = "portfolio-theme"

const getSystemPreference = (): Theme => {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

const readStoredTheme = (): Theme | null => {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (value === "dark" || value === "light") {
      return value
    }
  } catch {
    // Storage may be unavailable; ignore and fall back to system preference.
  }

  return null
}

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") {
    return
  }

  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
}

export function useTheme() {
  const [hasUserPreference, setHasUserPreference] = useState(() => {
    return Boolean(readStoredTheme())
  })

  const [theme, setTheme] = useState<Theme>(() => {
    return readStoredTheme() ?? getSystemPreference()
  })

  useEffect(() => {
    applyTheme(theme)

    if (!hasUserPreference || typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Storage might be unavailable (e.g. private mode); ignore errors.
    }
  }, [theme, hasUserPreference])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const syncWithSystem = () => {
      if (!hasUserPreference) {
        setTheme(mediaQuery.matches ? "dark" : "light")
      }
    }

    syncWithSystem()
    mediaQuery.addEventListener("change", syncWithSystem)
    return () => mediaQuery.removeEventListener("change", syncWithSystem)
  }, [hasUserPreference])

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === "dark" ? "light" : "dark"
      setHasUserPreference(true)
      return nextTheme
    })
  }

  return { theme, toggleTheme }
}

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

// Must match the key read by the inline script in index.html
const STORAGE_KEY = "theme";

// TODO: The OS color scheme is only read on page load (index.html). If the user hasn't
// toggled explicitly, changing the OS theme while the page is open won't update the app
// until reload. The old theme.css followed it live via @media (prefers-color-scheme).
// Fix: when localStorage has no "theme", listen to matchMedia("(prefers-color-scheme: dark)")
// change events and update the theme.
export function useTheme() {
  // index.html has already applied the stored or OS preference before first paint
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode etc.); theme still applies for this session
    }
    setTheme(next);
  };

  return { theme, toggleTheme };
}

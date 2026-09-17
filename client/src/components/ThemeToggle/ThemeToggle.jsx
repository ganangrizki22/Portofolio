import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";

// Menentukan tema awal: pakai pilihan tersimpan di localStorage kalau
// ada, kalau tidak ikuti preferensi sistem (prefers-color-scheme).
function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch (err) {
    // localStorage tidak bisa diakses (mode privat, dll.) -- lanjut ke fallback.
  }

  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      // abaikan jika localStorage tidak bisa diakses
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      title={isDark ? "Tema terang" : "Tema gelap"}
    >
      <i className={`bi ${isDark ? "bi-sun-fill" : "bi-moon-stars-fill"}`}></i>
    </button>
  );
}

export default ThemeToggle;

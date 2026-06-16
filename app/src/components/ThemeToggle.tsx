import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // On first render, read from the class already set by inline script in index.html
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true; // default dark
  });

  const applyTheme = useCallback((dark: boolean) => {
    const root = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (dark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('visa2au-theme', 'dark');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#0a0f1c');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('visa2au-theme', 'light');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#f1f5f9');
    }
  }, []);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark, applyTheme]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center transition-all group"
      style={{ borderColor: 'var(--border-subtle)' }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform" style={{ color: 'var(--gold)' }} aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform" style={{ color: 'var(--teal)' }} aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;

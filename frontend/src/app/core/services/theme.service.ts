import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'theme';
  private mediaQuery: MediaQueryList | null = null;

  init() {
    const saved = localStorage.getItem(this.key) || 'system';
    this.setTheme(saved as ThemeMode);
    this.setupSystemThemeListener();
  }

  private setupSystemThemeListener() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', () => {
      if (this.getTheme() === 'system') {
        this.applySystemTheme();
      }
    });
  }

  private applySystemTheme() {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
  }

setTheme(theme: ThemeMode) {
  console.log('Setting theme:', theme);

  const body = document.body;

  body.classList.remove('light-theme', 'dark-theme');

  if (theme === 'system') {
    this.applySystemTheme();
  } else {
    body.classList.add(`${theme}-theme`);
  }

  localStorage.setItem(this.key, theme);
}

  getTheme(): ThemeMode {
    return (localStorage.getItem(this.key) as ThemeMode) || 'system';
  }

  toggle() {
    const currentTheme = this.getTheme();
    if (currentTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'light' : 'dark');
    } else {
      this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }
  }
}

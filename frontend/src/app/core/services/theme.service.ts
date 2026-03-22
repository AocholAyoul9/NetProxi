import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'theme';
  private mediaQuery: MediaQueryList | null = null;
  private mediaListener: (() => void) | null = null;

  /** Initialize theme on app startup. */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = (localStorage.getItem(this.storageKey) as ThemeMode) ?? 'system';
    this.applyTheme(saved);
  }

  /** Persist and apply a theme choice. */
  setTheme(theme: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  /** Return the currently stored theme preference. */
  getTheme(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) return 'system';
    return (localStorage.getItem(this.storageKey) as ThemeMode) ?? 'system';
  }

  private applyTheme(theme: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.removeMediaListener();

    if (theme === 'system') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.applyDarkClass(this.mediaQuery.matches);
      this.mediaListener = () => this.applyDarkClass((this.mediaQuery as MediaQueryList).matches);
      this.mediaQuery.addEventListener('change', this.mediaListener);
    } else {
      this.applyDarkClass(theme === 'dark');
    }
  }

  private applyDarkClass(dark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.body.classList.toggle('dark-theme', dark);
  }

  private removeMediaListener(): void {
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
      this.mediaListener = null;
    }
  }
}

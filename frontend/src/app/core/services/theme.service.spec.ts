import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('dark-theme', 'light-theme');

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    document.body.classList.remove('dark-theme', 'light-theme');
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to "system" when no preference is stored', () => {
    expect(service.getTheme()).toBe('system');
  });

  it('should apply dark class when theme is set to dark', () => {
    service.setTheme('dark');
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
  });

  it('should remove dark class when theme is set to light', () => {
    document.body.classList.add('dark-theme');
    service.setTheme('light');
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
  });

  it('should persist theme in localStorage', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should return stored theme from getTheme()', () => {
    service.setTheme('light');
    expect(service.getTheme()).toBe('light');
  });

  it('should restore theme from localStorage on init()', () => {
    localStorage.setItem('theme', 'dark');
    service.init();
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
  });

  it('should apply system theme based on prefers-color-scheme', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    service.setTheme('system');
    if (prefersDark) {
      expect(document.body.classList.contains('dark-theme')).toBeTrue();
    } else {
      expect(document.body.classList.contains('light-theme')).toBeTrue();
    }
  });

  it('should store "system" in localStorage when system theme is selected', () => {
    service.setTheme('system');
    expect(localStorage.getItem('theme')).toBe('system');
  });

  it('should toggle from system to opposite of system preference', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    service.setTheme('system');
    service.toggle();
    if (prefersDark) {
      expect(service.getTheme()).toBe('light');
    } else {
      expect(service.getTheme()).toBe('dark');
    }
  });

  it('should toggle from dark to light', () => {
    service.setTheme('dark');
    service.toggle();
    expect(service.getTheme()).toBe('light');
  });

  it('should toggle from light to dark', () => {
    service.setTheme('light');
    service.toggle();
    expect(service.getTheme()).toBe('dark');
  });
});

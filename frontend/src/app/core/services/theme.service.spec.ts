import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('dark-theme');

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    document.body.classList.remove('dark-theme');
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
});

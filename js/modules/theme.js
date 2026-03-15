import { CONFIG } from '../config.js';
import { appState } from '../state.js';

export class ThemeManager {
  constructor() {
    this.body = document.body;
    this.toggleBtn = document.querySelector('[data-theme-toggle]');
    this.init();
  }

  init() {
    this.loadTheme();
    this.bindEvents();
  }

  setTheme(theme) {
    this.body.setAttribute('data-theme', theme);
    appState.theme = theme;
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
    
    if (this.toggleBtn) {
      this.toggleBtn.textContent = theme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная';
    }
  }

  loadTheme() {
    const saved = appState.theme || localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(saved || (systemDark ? 'dark' : 'light'));
  }

  toggleTheme() {
    const currentTheme = this.body.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  bindEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Следим за системными настройками
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
      if (!saved) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

import { CONFIG } from './config.js';

export class AppState {
  constructor() {
    this.theme = 'light';
    this.bookmarks = [];
    this.notes = [];
    this.progress = {};
    this.filters = {
      course: 'all',
      topic: 'all',
      difficulty: 'all'
    };
    this.searchHistory = [];
    this.loadState();
  }

  saveState() {
    try {
      const state = {
        theme: this.theme,
        bookmarks: this.bookmarks,
        notes: this.notes,
        progress: this.progress,
        filters: this.filters,
        searchHistory: this.searchHistory.slice(-20) // Сохраняем последние 20 поисков
      };
      localStorage.setItem('mathlab-state', JSON.stringify(state));
    } catch (error) {
      console.warn('Ошибка сохранения состояния:', error);
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem('mathlab-state');
      if (saved) {
        const state = JSON.parse(saved);
        Object.assign(this, state);
      }
    } catch (error) {
      console.warn('Ошибка загрузки состояния:', error);
    }
  }

  addBookmark(page, section, title, note = '') {
    const bookmark = {
      id: Date.now().toString(),
      page,
      section,
      title,
      note,
      createdAt: new Date().toISOString()
    };
    this.bookmarks.push(bookmark);
    this.saveState();
    return bookmark;
  }

  removeBookmark(id) {
    this.bookmarks = this.bookmarks.filter(b => b.id !== id);
    this.saveState();
  }

  addNote(page, section, content) {
    const note = {
      id: Date.now().toString(),
      page,
      section,
      content,
      createdAt: new Date().toISOString()
    };
    this.notes.push(note);
    this.saveState();
    return note;
  }

  updateProgress(topic, score, maxScore) {
    if (!this.progress[topic]) {
      this.progress[topic] = { attempts: 0, bestScore: 0, completed: false };
    }
    
    this.progress[topic].attempts++;
    this.progress[topic].bestScore = Math.max(this.progress[topic].bestScore, score);
    this.progress[topic].completed = score >= maxScore;
    this.progress[topic].lastAttempt = new Date().toISOString();
    
    this.saveState();
  }

  addToSearchHistory(query) {
    if (query && !this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      this.saveState();
    }
  }
}

export const appState = new AppState();

import { CONFIG } from '../config.js';
import { appState } from '../state.js';

export class BookmarkManager {
  constructor() {
    this.bookmarksPanel = null;
    this.notesPanel = null;
    this.init();
  }

  init() {
    this.createBookmarkUI();
    this.bindEvents();
    this.loadBookmarks();
  }

  createBookmarkUI() {
    // Создаём панель закладок если её нет
    if (!document.querySelector('[data-bookmarks-panel]')) {
      const panel = document.createElement('div');
      panel.className = 'bookmarks-panel glass-card';
      panel.setAttribute('data-bookmarks-panel', '');
      panel.innerHTML = `
        <div class="bookmarks-header">
          <h3>📚 Мои закладки</h3>
          <button class="close-btn" data-close-bookmarks>×</button>
        </div>
        <div class="bookmarks-content" data-bookmarks-content>
          <p class="empty-state">Закладок пока нет</p>
        </div>
      `;
      document.body.appendChild(panel);
    }

    // Создаём панель заметок
    if (!document.querySelector('[data-notes-panel]')) {
      const panel = document.createElement('div');
      panel.className = 'notes-panel glass-card';
      panel.setAttribute('data-notes-panel', '');
      panel.innerHTML = `
        <div class="notes-header">
          <h3>📝 Мои заметки</h3>
          <button class="close-btn" data-close-notes>×</button>
        </div>
        <div class="notes-content" data-notes-content>
          <p class="empty-state">Заметок пока нет</p>
        </div>
      `;
      document.body.appendChild(panel);
    }
  }

  addBookmark(page, section, title, note = '') {
    const bookmark = appState.addBookmark(page, section, title, note);
    this.renderBookmarks();
    this.showNotification('Закладка добавлена');
    return bookmark;
  }

  removeBookmark(id) {
    appState.removeBookmark(id);
    this.renderBookmarks();
    this.showNotification('Закладка удалена');
  }

  addNote(page, section, content) {
    const note = appState.addNote(page, section, content);
    this.renderNotes();
    this.showNotification('Заметка добавлена');
    return note;
  }

  renderBookmarks() {
    const content = document.querySelector('[data-bookmarks-content]');
    if (!content) return;

    const bookmarks = appState.bookmarks;
    
    if (bookmarks.length === 0) {
      content.innerHTML = '<p class="empty-state">Закладок пока нет</p>';
      return;
    }

    const bookmarksHTML = bookmarks.map(bookmark => `
      <div class="bookmark-item" data-bookmark-id="${bookmark.id}">
        <div class="bookmark-info">
          <a href="${bookmark.page}" class="bookmark-title">${bookmark.title}</a>
          <small class="bookmark-section">${bookmark.section}</small>
          ${bookmark.note ? `<p class="bookmark-note">${bookmark.note}</p>` : ''}
        </div>
        <div class="bookmark-actions">
          <button class="btn-small" data-edit-bookmark="${bookmark.id}">✏️</button>
          <button class="btn-small btn-danger" data-delete-bookmark="${bookmark.id}">🗑️</button>
        </div>
      </div>
    `).join('');

    content.innerHTML = bookmarksHTML;
  }

  renderNotes() {
    const content = document.querySelector('[data-notes-content]');
    if (!content) return;

    const notes = appState.notes;
    
    if (notes.length === 0) {
      content.innerHTML = '<p class="empty-state">Заметок пока нет</p>';
      return;
    }

    const notesHTML = notes.map(note => `
      <div class="note-item" data-note-id="${note.id}">
        <div class="note-info">
          <a href="${note.page}" class="note-page">${note.page}</a>
          <small class="note-section">${note.section}</small>
          <p class="note-content">${note.content}</p>
        </div>
        <div class="note-actions">
          <button class="btn-small" data-edit-note="${note.id}">✏️</button>
          <button class="btn-small btn-danger" data-delete-note="${note.id}">🗑️</button>
        </div>
      </div>
    `).join('');

    content.innerHTML = notesHTML;
  }

  loadBookmarks() {
    this.renderBookmarks();
    this.renderNotes();
  }

  exportBookmarks() {
    const data = {
      bookmarks: appState.bookmarks,
      notes: appState.notes,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathlab-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--gradient);
      color: white;
      padding: 1rem;
      border-radius: var(--radius-md);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  bindEvents() {
    // Кнопки закрытия панелей
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-close-bookmarks]')) {
        document.querySelector('[data-bookmarks-panel]').style.display = 'none';
      }
      if (e.target.matches('[data-close-notes]')) {
        document.querySelector('[data-notes-panel]').style.display = 'none';
      }
    });

    // Удаление закладок
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-delete-bookmark]')) {
        const id = e.target.getAttribute('data-delete-bookmark');
        this.removeBookmark(id);
      }
      if (e.target.matches('[data-delete-note]')) {
        const id = e.target.getAttribute('data-delete-note');
        appState.notes = appState.notes.filter(n => n.id !== id);
        appState.saveState();
        this.renderNotes();
        this.showNotification('Заметка удалена');
      }
    });

    // Глобальные хоткеи
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        this.toggleBookmarksPanel();
      }
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        this.toggleNotesPanel();
      }
    });
  }

  toggleBookmarksPanel() {
    const panel = document.querySelector('[data-bookmarks-panel]');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }

  toggleNotesPanel() {
    const panel = document.querySelector('[data-notes-panel]');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }
}

// Импортируем модули
import { CONFIG } from './config.js';
import { appState } from './state.js';
import { ThemeManager } from './modules/theme.js';
import { SearchManager } from './modules/search.js';
import { TheoremManager } from './modules/theorems.js';
import { BookmarkManager } from './modules/bookmarks.js';
import { NavigationManager } from './modules/navigation.js';
import { ExerciseManager } from './modules/exercises.js';
import { VisualizationManager } from './modules/visualization.js';
import { LazyLoader } from './modules/lazy-loader.js';
import { router } from './modules/router-simple.js';

// Глобальные переменные для совместимости
const BASE_SEARCH_INDEX = [
  { title: 'Главная: MathLab', text: 'Онлайн-справочник по математике для студентов', url: '/' },
  { title: 'О проекте MathLab', text: 'Документация проекта и маршрут по курсам 1–4', url: '/about.html' },
  { title: 'Теоремы: обзор', text: 'Каталог теорем с фильтрами, хэштегами и поиском', url: '/theorems.html' },
  { title: 'Интегралы: обзор', text: 'Разделы и ссылки на подробную теорию', url: '/integrals.html' },
  { title: 'Неопределённые интегралы', text: 'Определение, свойства, примеры вычислений', url: '/integrals-indefinite.html' },
  { title: 'Определённые интегралы', text: 'Интеграл Римана, Ньютон-Лейбниц, приложения', url: '/integrals-definite.html' },
  { title: 'Методы интегрирования', text: 'Замена переменной, по частям, разложение на дроби', url: '/integrals-methods.html' },
  { title: 'Производные: обзор', text: 'Структура раздела и подробные материалы', url: '/derivatives.html' },
  { title: 'Правила дифференцирования', text: 'Линейность, произведение, частное, цепное правило', url: '/derivatives-rules.html' },
  { title: 'Таблица производных', text: 'Элементарные функции и комментарии к применению', url: '/derivatives-table.html' },
  { title: 'Сложные примеры по производным', text: 'Многошаговые задачи с подробным разбором', url: '/derivatives-examples.html' },
  { title: 'Линейная алгебра', text: 'Матрицы, определители, системы уравнений', url: '/algebra.html' },
  { title: 'Геометрия в пространстве', text: 'Прямые и плоскости, параллельность и пересечение', url: '/geometry-space.html' },
  { title: 'Теория вероятностей', text: 'Случайные события, вероятность, распределения', url: '/probability-theory.html' },
  {title: 'Математическая статистика', text: 'Выборки, оценки, гипотезы, регрессия', url: '/statistics.html' },
  {title: 'Дифференциальные уравнения', text: 'ОДУ, системы, методы решения', url: '/differential-equations.html' },
  {title: 'Численные методы', text: 'Интерполяция, аппроксимация, численное интегрирование', url: '/numerical-methods.html' },
  {title: 'Комплексный анализ', text: 'Функции комплексного переменного, конформные отображения', url: '/complex-analysis.html' },
  {title: 'Дискретная математика', text: 'Графы, комбинаторика, теория кодирования', url: '/discrete-mathematics.html' }
];

// Загрузка теорем (временно из глобальной переменной)
const THEOREM_CATALOG = typeof window !== 'undefined' && window.THEOREM_CATALOG ? window.THEOREM_CATALOG : [];

class MathLabApp {
  constructor() {
    this.modules = {};
    this.isInitialized = false;
    this.init();
  }

  async init() {
    try {
      console.log('🚀 Запуск MathLab SPA...');
      
      // Показываем загрузочный экран
      this.showLoadingScreen();

      // Инициализация модулей
      await this.initializeModules();
      
      // Настройка продвинутых функций
      this.setupAdvancedFeatures();
      
      // Инициализация ленивой загрузки
      this.modules.lazyLoader.preloadCriticalResources();
      this.modules.lazyLoader.setupServiceWorker();
      
      // Скрываем загрузочный экран
      this.hideLoadingScreen();
      
      this.isInitialized = true;
      console.log('✅ MathLab SPA успешно инициализирован');
      
      // Показываем уведомление о готовности
      this.showReadyNotification();
      
    } catch (error) {
      console.error('❌ Ошибка инициализации MathLab:', error);
      this.showErrorScreen(error);
    }
  }

  async initializeModules() {
    console.log('📦 Инициализация модулей...');
    
    // Инициализация в правильном порядке
    this.modules.theme = new ThemeManager();
    console.log('✅ ThemeManager инициализирован');
    
    this.modules.search = new SearchManager();
    console.log('✅ SearchManager инициализирован');
    
    this.modules.navigation = new NavigationManager();
    console.log('✅ NavigationManager инициализирован');
    
    this.modules.bookmarks = new BookmarkManager();
    console.log('✅ BookmarkManager инициализирован');
    
    this.modules.exercises = new ExerciseManager();
    console.log('✅ ExerciseManager инициализирован');
    
    this.modules.visualization = new VisualizationManager();
    console.log('✅ VisualizationManager инициализирован');
    
    this.modules.lazyLoader = new LazyLoader();
    console.log('✅ LazyLoader инициализирован');
    
    // Роутер инициализируем последним
    this.modules.router = router;
    console.log('✅ Router инициализирован');
    
    console.log('✅ Все модули инициализированы');
  }

  setupAdvancedFeatures() {
    console.log('⚙️ Настройка продвинутых функций...');
    
    // Инициализация темы
    this.initializeTheme();
    
    // Прогресс-бар чтения
    this.setupReadingProgress();
    
    // Кнопка наверх
    this.setupScrollToTop();
    
    // Горячие клавиши
    this.setupGlobalShortcuts();
    
    // Плавные переходы между страницами
    this.setupPageTransitions();
    
    // Автосохранение
    this.setupAutoSave();
    
    console.log('✅ Продвинутые функции настроены');
  }

  initializeTheme() {
    // Загружаем сохранённую тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Обновляем кнопку темы
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      themeToggle.textContent = savedTheme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая';
    }
  }

  showLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
      <div class="loading-screen-content">
        <div class="loading-logo">
          <span class="brand">Math<span>Lab</span></span>
        </div>
        <div class="loading-spinner"></div>
        <p>Загрузка справочника...</p>
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
          <span class="progress-text">0%</span>
        </div>
      </div>
    `;
    
    // Стили для загрузочного экрана
    loadingScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: inherit;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      .loading-screen-content {
        text-align: center;
        max-width: 400px;
        padding: 2rem;
      }
      
      .loading-logo .brand {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin-bottom: 2rem;
        display: block;
      }
      
      .loading-logo .brand span {
        background: var(--gradient);
        -webkit-background-clip: text;
        color: transparent;
      }
      
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid var(--border);
        border-top: 4px solid var(--primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1.5rem;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .loading-progress {
        margin-top: 1.5rem;
      }
      
      .progress-bar {
        width: 100%;
        height: 4px;
        background: var(--border);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }
      
      .progress-fill {
        height: 100%;
        background: var(--gradient);
        transition: width 0.3s ease;
      }
      
      .progress-text {
        font-size: 0.9rem;
        color: var(--muted);
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingScreen);
    
    // Анимация прогресса
    this.animateLoadingProgress();
  }

  animateLoadingProgress() {
    const progressFill = document.querySelector('#loading-screen .progress-fill');
    const progressText = document.querySelector('#loading-screen .progress-text');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `${Math.round(progress)}%`;
      
      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 200);
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      // Доводим прогресс до 100%
      const progressFill = loadingScreen.querySelector('.progress-fill');
      const progressText = loadingScreen.querySelector('.progress-text');
      
      if (progressFill && progressText) {
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
      }
      
      // Задержка для анимации
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }, 300);
    }
  }

  showErrorScreen(error) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.innerHTML = `
        <div class="error-screen-content">
          <div class="error-icon">❌</div>
          <h2>Ошибка загрузки</h2>
          <p>Не удалось загрузить MathLab. Попробуйте обновить страницу.</p>
          <details style="margin-top: 1rem; text-align: left;">
            <summary>Технические детали</summary>
            <pre style="background: var(--surface-solid); padding: 1rem; border-radius: var(--radius-sm); overflow: auto; font-size: 0.8rem;">${error.message}</pre>
          </details>
          <button onclick="location.reload()" class="btn" style="margin-top: 1rem;">
            Обновить страницу
          </button>
        </div>
      `;
    }
  }

  showReadyNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <span>MathLab готов к работе!</span>
      </div>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--gradient);
      color: white;
      padding: 1rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-soft);
      z-index: 1000;
      animation: slideInRight 0.5s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .notification.success {
        background: linear-gradient(130deg, #10b981 0%, #059669 100%);
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  }

  setupReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: var(--gradient);
      z-index: 100;
      transition: width 0.2s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  setupScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Наверх страницы');
    scrollButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--gradient);
      color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 100;
      box-shadow: var(--shadow-card);
    `;
    
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollButton.style.opacity = '1';
        scrollButton.style.visibility = 'visible';
      } else {
        scrollButton.style.opacity = '0';
        scrollButton.style.visibility = 'hidden';
      }
    });
    
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  setupGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl + K - поиск
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('[data-search-input]');
        if (searchInput) searchInput.focus();
      }
      
      // Ctrl + B - закладки
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        this.modules.bookmarks?.toggleBookmarksPanel?.();
      }
      
      // Ctrl + N - заметки
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        this.modules.bookmarks?.toggleNotesPanel?.();
      }
      
      // Ctrl + E - упражнения
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        this.modules.exercises?.toggleExercisesPanel?.();
      }
      
      // Ctrl + V - визуализация
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        this.modules.visualization?.toggleVisualizationPanel?.();
      }
      
      // Ctrl + / - справка
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        this.showHelpModal();
      }
      
      // Escape - закрыть модальные окна
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Прямое управление темой
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая';
      });
    }
  }

  setupPageTransitions() {
    // Добавляем класс для анимации переходов
    const contentContainer = document.querySelector('[data-content-container]');
    if (contentContainer) {
      contentContainer.classList.add('page-transition');
    }
  }

  setupAutoSave() {
    // Автосохранение каждые 30 секунд
    setInterval(() => {
      appState.saveState();
      console.log('💾 Состояние автоматически сохранено');
    }, 30000);
  }

  showHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'help-modal glass-card';
    modal.innerHTML = `
      <div class="help-header">
        <h3>⌨️ Горячие клавиши</h3>
        <button class="close-btn" data-close-help>×</button>
      </div>
      <div class="help-content">
        <div class="shortcuts-grid">
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>K</kbd>
            <span>Поиск</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>B</kbd>
            <span>Закладки</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>N</kbd>
            <span>Заметки</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>E</kbd>
            <span>Упражнения</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>V</kbd>
            <span>Визуализация</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>/</kbd>
            <span>Справка</span>
          </div>
          <div class="shortcut-item">
            <kbd>Alt</kbd> + <kbd>1-9</kbd>
            <span>Навигация</span>
          </div>
          <div class="shortcut-item">
            <kbd>Escape</kbd>
            <span>Закрыть окна</span>
          </div>
        </div>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 1000;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      .shortcuts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      
      .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: var(--surface-solid);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
      }
      
      kbd {
        background: var(--surface-solid);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.2rem 0.4rem;
        font-family: monospace;
        font-size: 0.8rem;
        color: var(--text);
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Закрытие модального окна
    modal.querySelector('[data-close-help]').addEventListener('click', () => {
      modal.remove();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.remove();
      }
    });
  }

  closeAllModals() {
    document.querySelectorAll('.help-modal, .bookmarks-panel, .notes-panel, .exercises-panel, .visualization-panel').forEach(modal => {
      modal.style.display = 'none';
    });
  }

  // Публичные методы для доступа к модулям
  getModule(name) {
    return this.modules[name];
  }

  // Статус приложения
  getStatus() {
    return {
      initialized: this.isInitialized,
      modules: Object.keys(this.modules),
      version: CONFIG?.version || '1.0.0'
    };
  }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  window.mathLabApp = new MathLabApp();
});

// Экспортируем для использования в других скриптах
export { MathLabApp };

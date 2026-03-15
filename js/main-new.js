// Импортируем модули
import { CONFIG } from './config.js';
import { appState } from './state.js';
import { ThemeManager } from './modules/theme.js';
import { SearchManager } from './modules/search.js';
import { TheoremManager } from './modules/theorems.js';
import { BookmarkManager } from './modules/bookmarks.js';
import { ExerciseManager } from './modules/exercises.js';
import { VisualizationManager } from './modules/visualization.js';
import { LazyLoader } from './modules/lazy-loader.js';

// Глобальные переменные для совместимости со старым кодом
const BASE_SEARCH_INDEX = [
  { title: 'Главная: MathLab', text: 'Онлайн-справочник по математике для студентов', url: 'index.html' },
  { title: 'О проекте MathLab', text: 'Документация проекта и маршрут по курсам 1–4', url: 'about.html' },
  { title: 'Теоремы: обзор', text: 'Каталог теорем с фильтрами, хэштегами и поиском', url: 'theorems.html' },
  { title: 'Интегралы: обзор', text: 'Разделы и ссылки на подробную теорию', url: 'integrals.html' },
  { title: 'Неопределённые интегралы', text: 'Определение, свойства, примеры вычислений', url: 'integrals-indefinite.html' },
  { title: 'Определённые интегралы', text: 'Интеграл Римана, Ньютон-Лейбниц, приложения', url: 'integrals-definite.html' },
  { title: 'Методы интегрирования', text: 'Замена переменной, по частям, разложение на дроби', url: 'integrals-methods.html' },
  { title: 'Производные: обзор', text: 'Структура раздела и подробные материалы', url: 'derivatives.html' },
  { title: 'Правила дифференцирования', text: 'Линейность, произведение, частное, цепное правило', url: 'derivatives-rules.html' },
  { title: 'Таблица производных', text: 'Элементарные функции и комментарии к применению', url: 'derivatives-table.html' },
  { title: 'Сложные примеры по производным', text: 'Многошаговые задачи с подробным разбором', url: 'derivatives-examples.html' },
  { title: 'Линейная алгебра', text: 'Матрицы, определители, системы уравнений', url: 'algebra.html' },
  { title: 'Геометрия в пространстве', text: 'Прямые и плоскости, параллельность и пересечение', url: 'geometry-space.html' },
  { title: 'Теория вероятностей', text: 'Случайные события, вероятность, распределения', url: 'probability-theory.html' },
  {title: 'Математическая статистика', text: 'Выборки, оценки, гипотезы, регрессия', url: 'statistics.html' },
  {title: 'Дифференциальные уравнения', text: 'ОДУ, системы, методы решения', url: 'differential-equations.html' },
  {title: 'Численные методы', text: 'Интерполяция, аппроксимация, численное интегрирование', url: 'numerical-methods.html' },
  {title: 'Комплексный анализ', text: 'Функции комплексного переменного, конформные отображения', url: 'complex-analysis.html' },
  {title: 'Дискретная математика', text: 'Графы, комбинаторика, теория кодирования', url: 'discrete-mathematics.html' }
];

// Загрузка теорем (временно из глобальной переменной)
const THEOREM_CATALOG = typeof window !== 'undefined' && window.THEOREM_CATALOG ? window.THEOREM_CATALOG : [];

class MathLabApp {
  constructor() {
    this.modules = {};
    this.init();
  }

  async init() {
    try {
      // Инициализация модулей
      this.modules.theme = new ThemeManager();
      this.modules.search = new SearchManager();
      this.modules.theorems = new TheoremManager();
      this.modules.bookmarks = new BookmarkManager();
      this.modules.navigation = new NavigationManager();
      this.modules.exercises = new ExerciseManager();
      this.modules.visualization = new VisualizationManager();
      this.modules.lazyLoader = new LazyLoader();

      // Дополнительные улучшения
      this.setupAdvancedFeatures();
      
      // Инициализация ленивой загрузки
      this.modules.lazyLoader.preloadCriticalResources();
      this.modules.lazyLoader.setupServiceWorker();
      
      console.log('MathLab инициализирован успешно');
    } catch (error) {
      console.error('Ошибка инициализации MathLab:', error);
    }
  }

  setupAdvancedFeatures() {
    // Прогресс-бар чтения
    this.setupReadingProgress();
    
    // Кнопка наверх
    this.setupScrollToTop();
    
    // Хлебные крошки
    this.generateBreadcrumbs();
    
    // Горячие клавиши
    this.setupGlobalShortcuts();
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

  generateBreadcrumbs() {
    const path = window.location.pathname.split('/').filter(Boolean);
    const breadcrumbs = document.createElement('nav');
    breadcrumbs.className = 'breadcrumbs';
    breadcrumbs.setAttribute('aria-label', 'Навигация по сайту');
    
    let breadcrumbHTML = '<a href="index.html">Главная</a>';
    
    if (path.length > 0 && path[0] !== 'index.html') {
      breadcrumbHTML += ' > ';
      
      if (path[0].startsWith('theorem-')) {
        breadcrumbHTML += '<a href="theorems.html">Теоремы</a> > ';
        breadcrumbHTML += `<span>${this.getPageTitle()}</span>`;
      } else if (path[0].includes('-')) {
        const parts = path[0].split('-');
        const section = parts[0];
        breadcrumbHTML += `<a href="${section}.html">${this.getSectionName(section)}</a> > `;
        breadcrumbHTML += `<span>${this.getPageTitle()}</span>`;
      } else {
        breadcrumbHTML += `<span>${this.getPageTitle()}</span>`;
      }
    }
    
    breadcrumbs.innerHTML = breadcrumbHTML;
    
    const header = document.querySelector('.site-header');
    if (header && path.length > 0 && path[0] !== 'index.html') {
      header.insertAdjacentElement('afterend', breadcrumbs);
    }
  }

  getPageTitle() {
    const title = document.title.replace('MathLab — ', '');
    return title;
  }

  getSectionName(section) {
    const sectionNames = {
      'integrals': 'Интегралы',
      'derivatives': 'Производные',
      'algebra': 'Линейная алгебра',
      'geometry': 'Геометрия',
      'probability': 'Теория вероятностей',
      'statistics': 'Математическая статистика',
      'differential': 'Дифференциальные уравнения',
      'numerical': 'Численные методы',
      'complex': 'Комплексный анализ',
      'discrete': 'Дискретная математика'
    };
    
    return sectionNames[section] || section;
  }

  setupGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
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
      
      // Ctrl + / - показать справку по горячим клавишам
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        this.showHelpModal();
      }
    });
  }

  showHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'help-modal glass-card';
    modal.innerHTML = `
      <div class="help-header">
        <h3>Горячие клавиши</h3>
        <button class="close-btn" data-close-help>×</button>
      </div>
      <div class="help-content">
        <ul>
          <li><kbd>Ctrl</kbd> + <kbd>K</kbd> - Поиск</li>
          <li><kbd>Ctrl</kbd> + <kbd>B</kbd> - Закладки</li>
          <li><kbd>Ctrl</kbd> + <kbd>N</kbd> - Заметки</li>
          <li><kbd>Ctrl</kbd> + <kbd>/</kbd> - Справка</li>
          <li><kbd>Alt</kbd> + <kbd>1-9</kbd> - Навигация по разделам</li>
          <li><kbd>Escape</kbd> - Закрыть модальные окна</li>
        </ul>
      </div>
    `;
    
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 1000;
    `;
    
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
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  window.mathLabApp = new MathLabApp();
});

// Экспортируем для использования в других скриптах
export { MathLabApp };

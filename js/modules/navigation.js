import { appState } from '../state.js';

export class NavigationManager {
  constructor() {
    this.currentYear = document.querySelector('[data-current-year]');
    this.init();
  }

  init() {
    this.updateCurrentYear();
    this.setupSmoothScrolling();
    this.setupActiveNavigation();
    this.setupKeyboardNavigation();
  }

  updateCurrentYear() {
    if (this.currentYear) {
      this.currentYear.textContent = new Date().getFullYear();
    }
  }

  setupSmoothScrolling() {
    // Плавная прокрутка для якорных ссылок
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        const targetId = link.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }

  setupActiveNavigation() {
    // Подсветка активной страницы в навигации
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  setupKeyboardNavigation() {
    // Навигация с клавиатуры
    document.addEventListener('keydown', (e) => {
      // Alt + цифры для быстрой навигации
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        const navLinks = document.querySelectorAll('.nav-links a');
        const index = parseInt(e.key) - 1;
        
        if (navLinks[index]) {
          navLinks[index].click();
        }
      }

      // Ctrl + K для фокуса на поиске
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('[data-search-input]');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape для очистки поиска
      if (e.key === 'Escape') {
        const searchInput = document.querySelector('[data-search-input]');
        const searchResults = document.querySelector('[data-search-results]');
        
        if (searchInput && document.activeElement === searchInput) {
          searchInput.value = '';
          searchInput.blur();
        }
        
        if (searchResults) {
          searchResults.classList.remove('active');
        }
      }
    });
  }

  // Прогресс-бар чтения статьи
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

  // Хлебные крошки
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
    
    // Вставляем после хедера
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

  // Кнопка "Наверх"
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
}

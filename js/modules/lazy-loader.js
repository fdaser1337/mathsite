import { CONFIG } from '../config.js';

export class LazyLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.observers = new Map();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupPreloading();
  }

  setupIntersectionObserver() {
    // Наблюдатель за элементами в области видимости
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadElement(entry.target);
              this.intersectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px', // Начинаем загрузку за 50px до появления в видимости
          threshold: 0.1
        }
      );
    }
  }

  setupPreloading() {
    // Предзагрузка контента при наведении
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href]');
      if (link && this.shouldPreload(link)) {
        this.preloadPage(link.href);
      }
    }, { passive: true });

    // Предзагрузка при фокусе с клавиатуры
    document.addEventListener('focusin', (e) => {
      const link = e.target.closest('a[href]');
      if (link && this.shouldPreload(link)) {
        this.preloadPage(link.href);
      }
    });
  }

  shouldPreload(link) {
    const href = link.getAttribute('href');
    return href && 
           href.startsWith('/') || href.includes('.html') && 
           !href.includes('#') && 
           !href.includes('http') &&
           !this.cache.has(href);
  }

  async loadElement(element) {
    const loadType = element.getAttribute('data-lazy-load');
    
    switch (loadType) {
      case 'image':
        await this.loadImage(element);
        break;
      case 'content':
        await this.loadContent(element);
        break;
      case 'theorem':
        await this.loadTheorem(element);
        break;
      case 'exercise':
        await this.loadExercise(element);
        break;
    }
  }

  async loadImage(element) {
    const src = element.getAttribute('data-src');
    if (!src) return;

    try {
      const img = new Image();
      img.src = src;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      element.src = src;
      element.classList.remove('lazy-loading');
      element.classList.add('lazy-loaded');
    } catch (error) {
      console.warn('Ошибка загрузки изображения:', src, error);
      element.classList.add('lazy-error');
    }
  }

  async loadContent(element) {
    const url = element.getAttribute('data-content-url');
    if (!url) return;

    try {
      const content = await this.fetchWithCache(url);
      element.innerHTML = content;
      element.classList.remove('lazy-loading');
      element.classList.add('lazy-loaded');
      
      // Инициализируем компоненты в загруженном контенте
      this.initializeContent(element);
    } catch (error) {
      console.warn('Ошибка загрузки контента:', url, error);
      element.classList.add('lazy-error');
    }
  }

  async loadTheorem(element) {
    const theoremId = element.getAttribute('data-theorem-id');
    if (!theoremId) return;

    try {
      const theorem = await this.fetchTheorem(theoremId);
      this.renderTheorem(element, theorem);
      element.classList.remove('lazy-loading');
      element.classList.add('lazy-loaded');
    } catch (error) {
      console.warn('Ошибка загрузки теоремы:', theoremId, error);
      element.classList.add('lazy-error');
    }
  }

  async loadExercise(element) {
    const exerciseId = element.getAttribute('data-exercise-id');
    if (!exerciseId) return;

    try {
      const exercise = await this.fetchExercise(exerciseId);
      this.renderExercise(element, exercise);
      element.classList.remove('lazy-loading');
      element.classList.add('lazy-loaded');
    } catch (error) {
      console.warn('Ошибка загрузки упражнения:', exerciseId, error);
      element.classList.add('lazy-error');
    }
  }

  async fetchWithCache(url) {
    // Проверяем кэш
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // Проверяем, не загружается ли уже
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // Начинаем загрузку
    const loadingPromise = this.fetchData(url);
    this.loadingPromises.set(url, loadingPromise);

    try {
      const data = await loadingPromise;
      this.cache.set(url, data);
      return data;
    } finally {
      this.loadingPromises.delete(url);
    }
  }

  async fetchData(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json, text/html',
          'Cache-Control': 'max-age=3600'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      throw new Error(`Ошибка загрузки ${url}: ${error.message}`);
    }
  }

  async fetchTheorem(theoremId) {
    const data = await this.fetchWithCache(CONFIG.API_ENDPOINTS.THEOREMS);
    return data.theorems.find(t => t.id === theoremId);
  }

  async fetchExercise(exerciseId) {
    const data = await this.fetchWithCache(CONFIG.API_ENDPOINTS.EXERCISES);
    return data.exercises.find(e => e.id === exerciseId);
  }

  renderTheorem(element, theorem) {
    if (!theorem) {
      element.innerHTML = '<p class="error">Теорема не найдена</p>';
      return;
    }

    element.innerHTML = `
      <div class="theorem-content">
        <h3>${theorem.title}</h3>
        <div class="theorem-description">${theorem.description}</div>
        <div class="theorem-formula">
          ${theorem.sections.statement.formula ? 
            `<div class="math-box">$${theorem.sections.statement.formula}$</div>` : ''}
        </div>
        <div class="theorem-tags">
          ${theorem.tags.map(tag => `<span class="hash-tag">#${tag}</span>`).join('')}
        </div>
      </div>
    `;

    // Инициализируем MathJax если нужно
    if (window.MathJax) {
      window.MathJax.typesetPromise([element]);
    }
  }

  renderExercise(element, exercise) {
    if (!exercise) {
      element.innerHTML = '<p class="error">Упражнение не найдено</p>';
      return;
    }

    element.innerHTML = `
      <div class="exercise-content">
        <h4>${exercise.title}</h4>
        <div class="exercise-question">${exercise.question}</div>
        <div class="exercise-difficulty difficulty-${exercise.difficulty}">
          ${this.getDifficultyText(exercise.difficulty)}
        </div>
        <div class="exercise-meta">
          <span class="points">${exercise.points} баллов</span>
          <span class="time-limit">${exercise.timeLimit} сек</span>
        </div>
      </div>
    `;
  }

  getDifficultyText(difficulty) {
    const difficulties = {
      'easy': 'Легко',
      'medium': 'Средне',
      'hard': 'Сложно'
    };
    return difficulties[difficulty] || difficulty;
  }

  initializeContent(element) {
    // Инициализация компонентов в динамически загруженном контенте
    const scripts = element.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.textContent = script.textContent;
      newScript.type = script.type || 'text/javascript';
      document.head.appendChild(newScript);
      document.head.removeChild(newScript);
    });

    // Инициализация MathJax
    if (window.MathJax) {
      window.MathJax.typesetPromise([element]);
    }
  }

  async preloadPage(url) {
    if (this.cache.has(url)) return;

    try {
      await this.fetchWithCache(url);
      console.log('Предзагружена страница:', url);
    } catch (error) {
      console.warn('Ошибка предзагрузки страницы:', url, error);
    }
  }

  observe(element) {
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
      element.classList.add('lazy-loading');
    }
  }

  unobserve(element) {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(element);
    }
  }

  clearCache() {
    this.cache.clear();
    console.log('Кэш очищен');
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      loading: this.loadingPromises.size,
      keys: Array.from(this.cache.keys())
    };
  }

  preloadCriticalResources() {
    // Предзагрузка критических ресурсов
    const criticalUrls = [
      CONFIG.API_ENDPOINTS.THEOREMS,
      CONFIG.API_ENDPOINTS.EXERCISES
    ];

    criticalUrls.forEach(url => {
      this.preloadPage(url);
    });
  }

  setupServiceWorker() {
    // Регистрация Service Worker для оффлайн работы
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker зарегистрирован:', registration);
        })
        .catch(error => {
          console.warn('Ошибка регистрации Service Worker:', error);
        });
    }
  }
}

// Глобальный экземпляр
export const lazyLoader = new LazyLoader();

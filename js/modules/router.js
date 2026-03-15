import { CONFIG } from '../config.js';
import { appState } from '../state.js';

// Lazy loader будет инициализирован позже
let lazyLoader = null;

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.contentContainer = null;
    this.pageCache = new Map();
    this.init();
  }

  init() {
    this.setupContentContainer();
    this.setupRoutes();
    this.setupEventListeners();
    this.handleInitialRoute();
  }

  setupContentContainer() {
    // Находим или создаём контейнер для контента
    this.contentContainer = document.querySelector('[data-content-container]');
    if (!this.contentContainer) {
      const main = document.querySelector('main');
      if (main) {
        main.innerHTML = '<div data-content-container></div>';
        this.contentContainer = document.querySelector('[data-content-container]');
      }
    }
  }

  setupRoutes() {
    // Определяем маршруты
    this.routes.set('/', () => this.loadHomePage());
    this.routes.set('/index.html', () => this.loadHomePage());
    
    // Разделы математики
    this.routes.set('/theorems.html', () => this.loadTheoremsPage());
    this.routes.set('/integrals.html', () => this.loadIntegralsPage());
    this.routes.set('/derivatives.html', () => this.loadDerivativesPage());
    this.routes.set('/algebra.html', () => this.loadAlgebraPage());
    this.routes.set('/geometry-space.html', () => this.loadGeometryPage());
    
    // Новые разделы
    this.routes.set('/probability-theory.html', () => this.loadProbabilityPage());
    this.routes.set('/statistics.html', () => this.loadStatisticsPage());
    this.routes.set('/differential-equations.html', () => this.loadDifferentialEquationsPage());
    this.routes.set('/numerical-methods.html', () => this.loadNumericalMethodsPage());
    this.routes.set('/complex-analysis.html', () => this.loadComplexAnalysisPage());
    this.routes.set('/discrete-mathematics.html', () => this.loadDiscreteMathematicsPage());
    
    // Теоремы
    this.routes.set('/theorem-:id.html', (params) => this.loadTheoremPage(params.id));
    
    // О проекте
    this.routes.set('/about.html', () => this.loadAboutPage());
    
    // 404
    this.routes.set('*', () => this.load404Page());
  }

  setupEventListeners() {
    // Обработка кликов по ссылкам
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && this.shouldInterceptLink(link)) {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        // Для GitHub Pages используем хеш-роутинг
        if (this.useHashRouting()) {
          this.navigateHash(href);
        } else {
          this.navigate(href);
        }
      }
    });

    // Обработка изменения хеша
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });

    // Обработка навигации браузера
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.route) {
        this.loadRoute(e.state.route, false);
      }
    });
  }

  shouldInterceptLink(link) {
    const href = link.getAttribute('href');
    return href && 
           !href.startsWith('http') && 
           !href.startsWith('#') && 
           !href.startsWith('mailto:') &&
           !href.startsWith('tel:') &&
           !link.hasAttribute('target') &&
           !link.hasAttribute('download');
  }

  useHashRouting() {
    // Определяем, нужно ли использовать хеш-роутинг
    return window.location.hostname.includes('github.io') || 
           window.location.pathname.includes('/mathsite/');
  }

  navigateHash(path) {
    // Для хеш-роутинга используем #!/path
    const hash = path === '/' ? '#!/' : '#!' + path;
    window.location.hash = hash;
  }

  navigate(path) {
    if (path.startsWith('#')) {
      // Якорная ссылка - прокручиваем к элементу
      this.scrollToAnchor(path.slice(1));
      return;
    }

    // Обновляем URL без перезагрузки страницы
    if (this.useHashRouting()) {
      this.navigateHash(path);
    } else {
      history.pushState({ route: path }, '', path);
      this.loadRoute(path);
    }
  }

  async loadRoute(path, updateHistory = true) {
    if (this.currentRoute === path) return;

    try {
      // Показываем индикатор загрузки
      this.showLoading();

      // Ищем подходящий маршрут
      const route = this.findRoute(path);
      
      if (route) {
        this.currentRoute = path;
        await route.handler(route.params);
        this.updateActiveNavigation(path);
        
        // Обновляем заголовок страницы
        this.updatePageTitle(path);
        
        // Прокручиваем наверх
        window.scrollTo(0, 0);
      } else {
        await this.load404Page();
      }
    } catch (error) {
      console.error('Ошибка загрузки маршрута:', error);
      await this.loadErrorPage(error);
    } finally {
      this.hideLoading();
    }
  }

  findRoute(path) {
    // Точное совпадение
    if (this.routes.has(path)) {
      return { handler: this.routes.get(path), params: {} };
    }

    // Параметризованные маршруты
    for (const [routePath, handler] of this.routes) {
      const params = this.matchRoute(routePath, path);
      if (params !== null) {
        return { handler, params };
      }
    }

    // Wildcard
    if (this.routes.has('*')) {
      return { handler: this.routes.get('*'), params: {} };
    }

    return null;
  }

  matchRoute(routePath, actualPath) {
    const routeParts = routePath.split('/');
    const pathParts = actualPath.split('/');

    if (routeParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];

      if (routePart.startsWith(':')) {
        // Параметр
        const paramName = routePart.slice(1);
        params[paramName] = pathPart;
      } else if (routePart !== pathPart) {
        // Не совпадает
        return null;
      }
    }

    return params;
  }

  handleInitialRoute() {
    if (this.useHashRouting()) {
      this.handleHashChange();
    } else {
      const path = window.location.pathname;
      this.loadRoute(path, false);
    }
  }

  handleHashChange() {
    const hash = window.location.hash;
    let path = '/';
    
    if (hash.startsWith('#!/')) {
      path = hash.slice(2); // Убираем '#!/'
      if (!path) path = '/';
    }
    
    this.loadRoute(path, false);
    
    // Обрабатываем якоря в хеше
    if (hash.includes('#') && !hash.startsWith('#!/')) {
      const anchorId = hash.slice(1);
      this.scrollToAnchor(anchorId);
    }
  }

  scrollToAnchor(anchorId) {
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Методы загрузки страниц
  async loadHomePage() {
    const content = await this.loadPageContent('home');
    this.renderContent(content);
  }

  async loadTheoremsPage() {
    const content = await this.generateTheoremsPage();
    this.renderContent(content);
  }

  async loadIntegralsPage() {
    const content = await this.generateContentPage('integrals');
    this.renderContent(content);
  }

  async loadDerivativesPage() {
    const content = await this.generateContentPage('derivatives');
    this.renderContent(content);
  }

  async loadAlgebraPage() {
    const content = await this.generateContentPage('algebra');
    this.renderContent(content);
  }

  async loadGeometryPage() {
    const content = await this.generateContentPage('geometry');
    this.renderContent(content);
  }

  async loadProbabilityPage() {
    const content = await this.generateContentPage('probability-theory');
    this.renderContent(content);
  }

  async loadStatisticsPage() {
    const content = await this.generateContentPage('statistics');
    this.renderContent(content);
  }

  async loadDifferentialEquationsPage() {
    const content = await this.generateContentPage('differential-equations');
    this.renderContent(content);
  }

  async loadNumericalMethodsPage() {
    const content = await this.generateContentPage('numerical-methods');
    this.renderContent(content);
  }

  async loadComplexAnalysisPage() {
    const content = await this.generateContentPage('complex-analysis');
    this.renderContent(content);
  }

  async loadDiscreteMathematicsPage() {
    const content = await this.generateContentPage('discrete-mathematics');
    this.renderContent(content);
  }

  async loadTheoremPage(theoremId) {
    const content = await this.generateTheoremPage(theoremId);
    this.renderContent(content);
  }

  async loadAboutPage() {
    const content = await this.loadPageContent('about');
    this.renderContent(content);
  }

  async load404Page() {
    const content = `
      <section class="hero">
        <h1>Страница не найдена</h1>
        <p>К сожалению, запрашиваемая страница не существует.</p>
        <a href="/" class="btn">На главную</a>
      </section>
    `;
    this.renderContent(content);
  }

  async loadErrorPage(error) {
    const content = `
      <section class="hero">
        <h1>Произошла ошибка</h1>
        <p>При загрузке страницы произошла ошибка. Попробуйте обновить страницу.</p>
        <a href="/" class="btn">На главную</a>
      </section>
    `;
    this.renderContent(content);
  }

  async loadPageContent(pageType, params = {}) {
    try {
      // Пробуем загрузить из кэша
      const cacheKey = `page-${pageType}-${JSON.stringify(params)}`;
      
      if (this.pageCache && this.pageCache.has(cacheKey)) {
        return this.pageCache.get(cacheKey);
      }

      // Загружаем данные
      let content;
      
      switch (pageType) {
        case 'home':
          content = await this.generateHomePage();
          break;
        case 'theorems':
          content = await this.generateTheoremsPage();
          break;
        case 'theorem':
          content = await this.generateTheoremPage(params.theoremId);
          break;
        default:
          content = await this.generateContentPage(pageType);
      }

      // Кэшируем результат
      if (!this.pageCache) {
        this.pageCache = new Map();
      }
      this.pageCache.set(cacheKey, content);

      return content;
    } catch (error) {
      console.error('Ошибка загрузки контента:', error);
      throw error;
    }
  }

  async generateHomePage() {
    return `
      <section class="hero">
        <span class="tag">Академичный справочник для студентов</span>
        <h1>MathLab: подробная теория, доказательства и примеры</h1>
        <p>MathLab объединяет базовые и продвинутые разделы высшей математики в единой структуре: от формулировок теорем до пошаговых решений задач и объяснения методик вычислений.</p>
        <a href="#theorems" class="btn">Открыть разделы</a>
        <div class="hero-grid">
          <article class="glass-card card"><h3>Структурированная теория</h3><p>Каждая тема разбита на определения, формулировки, доказательства и практические выводы.</p></article>
          <article class="glass-card card"><h3>Единый стиль записи</h3><p>Формулы и математические выражения оформлены через MathJax для корректного чтения.</p></article>
          <article class="glass-card card"><h3>Навигация и поиск</h3><p>Поиск работает по заголовкам и описаниям, ускоряя переход к нужной теме.</p></article>
        </div>
      </section>

      <section class="section" id="theorems">
        <h2>Разделы математики</h2>
        <div class="card-grid">
          <a href="/theorems.html" class="glass-card card">
            <h3>📐 Теоремы</h3>
            <p>Каталог теорем с фильтрами и поиском</p>
          </a>
          <a href="/integrals.html" class="glass-card card">
            <h3>∫ Интегралы</h3>
            <p>Неопределённые и определённые интегралы</p>
          </a>
          <a href="/derivatives.html" class="glass-card card">
            <h3>∂ Производные</h3>
            <p>Правила дифференцирования и таблицы</p>
          </a>
          <a href="/algebra.html" class="glass-card card">
            <h3>🔢 Линейная алгебра</h3>
            <p>Матрицы, определители, системы</p>
          </a>
          <a href="/geometry-space.html" class="glass-card card">
            <h3>📏 Геометрия</h3>
            <p>Прямые, плоскости, пространства</p>
          </a>
          <a href="/probability-theory.html" class="glass-card card">
            <h3>🎲 Теория вероятностей</h3>
            <p>Случайные события и распределения</p>
          </a>
          <a href="/statistics.html" class="glass-card card">
            <h3>📊 Статистика</h3>
            <p>Описательная статистика и гипотезы</p>
          </a>
          <a href="/differential-equations.html" class="glass-card card">
            <h3>🔄 Дифференциальные уравнения</h3>
            <p>ОДУ и системы уравнений</p>
          </a>
          <a href="/numerical-methods.html" class="glass-card card">
            <h3>💻 Численные методы</h3>
            <p>Интерполяция и численное интегрирование</p>
          </a>
          <a href="/complex-analysis.html" class="glass-card card">
            <h3>🌀 Комплексный анализ</h3>
            <p>Функции комплексного переменного</p>
          </a>
          <a href="/discrete-mathematics.html" class="glass-card card">
            <h3>🔗 Дискретная математика</h3>
            <p>Графы, комбинаторика, кодирование</p>
          </a>
        </div>
      </section>
    `;
  }

  async generateTheoremsPage() {
    try {
      // Загружаем теоремы из JSON
      let theoremsData;
      try {
        const response = await fetch('/data/theorems.json');
        if (response.ok) {
          theoremsData = await response.json();
        } else {
          throw new Error('Failed to load theorems');
        }
      } catch (error) {
      console.warn('Using fallback theorems data:', error);
      // Используем базовые данные если загрузка не удалась
      theoremsData = {
        theorems: [
          {
            id: "pythagoras",
            title: "Теорема Пифагора",
            url: "theorem-pythagoras.html",
            course: "1",
            difficulty: "basic",
            category: "geometry",
            tags: ["геометрия", "евклидова-геометрия", "треугольники"],
            description: "Фундаментальный результат евклидовой геометрии, связывающий стороны прямоугольного треугольника."
          }
        ]
      };
    }
    }
    
    let content = `
      <section class="hero">
        <span class="tag">Раздел теорем</span>
        <h1>Теоремы с полным академическим изложением</h1>
        <p>Каждая теорема вынесена на отдельную страницу: строгая формулировка, доказательство, примеры и ссылки на видеоразборы МФТИ Study.</p>
      </section>
    `;

    // Фильтры
    content += `
      <section class="section">
        <div class="course-filter" data-course-filter>
          <button type="button" class="course-filter-btn active" data-course="all">Все курсы</button>
          <button type="button" class="course-filter-btn" data-course="1">1 курс</button>
          <button type="button" class="course-filter-btn" data-course="2">2 курс</button>
          <button type="button" class="course-filter-btn" data-course="3">3 курс</button>
          <button type="button" class="course-filter-btn" data-course="4">4 курс</button>
        </div>
        <div class="filter-status" data-filter-status aria-live="polite"></div>
      </section>
    `;

    // Список теорем
    content += '<section class="section"><div class="card-grid triple" data-theorem-grid">';
    
    theoremsData.theorems.forEach(theorem => {
      const tags = theorem.tags.map(tag => `<span class="hash-tag">#${tag}</span>`).join('');
      content += `
        <a class="glass-card card theorem-card" data-theorem-card data-courses="${theorem.course}" href="/theorem-${theorem.id}.html">
          <h3>${theorem.title}</h3>
          <p>${theorem.description}</p>
          <div class="theorem-tags">
            ${tags}
            <span class="hash-tag hash-tag-course" data-hash-course="${theorem.course}">#курс-${theorem.course}</span>
          </div>
        </a>
      `;
    });
    
    content += '</div></section>';
    
    return content;
  }

  async generateTheoremPage(theoremId) {
    const theoremsData = await this.loadTheoremsData();
    const theorem = theoremsData.theorems.find(t => t.id === theoremId);
    
    if (!theorem) {
      return this.load404Page();
    }

    let content = `
      <section class="hero">
        <span class="tag">Отдельная теорема</span>
        <h1>${theorem.title}</h1>
        <p>${theorem.description}</p>
      </section>
    `;

    // Формулировка
    if (theorem.sections && theorem.sections.statement) {
      content += `
        <section class="section">
          <article class="glass-card content-block">
            <h3>Формулировка</h3>
            <p>${theorem.sections.statement.content}</p>
            ${theorem.sections.statement.formula ? 
              `<div class="math-box">$${theorem.sections.statement.formula}$</div>` : ''}
          </article>
        </section>
      `;
    }

    // Доказательство
    if (theorem.sections && theorem.sections.proof) {
      content += `
        <section class="section">
          <article class="glass-card content-block">
            <h3>Доказательство</h3>
            <p>${theorem.sections.proof.content}</p>
            ${theorem.sections.proof.steps ? 
              `<ol>${theorem.sections.proof.steps.map(step => `<li>${step}</li>`).join('')}</ol>` : ''}
          </article>
        </section>
      `;
    }

    // Примеры
    if (theorem.sections && theorem.sections.examples) {
      content += `
        <section class="section">
          <h2>Примеры</h2>
          ${theorem.sections.examples.map(example => `
            <article class="glass-card content-block">
              <h4>${example.title}</h4>
              <p>${example.content}</p>
              ${example.solution ? `<div class="math-box">${example.solution}</div>` : ''}
            </article>
          `).join('')}
        </section>
      `;
    }

    return content;
  }

  async loadTheoremsData() {
    try {
      const response = await fetch('/data/theorems.json');
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to load theorems');
      }
    } catch (error) {
      console.warn('Using fallback theorems data:', error);
      return {
        theorems: [
          {
            id: "pythagoras",
            title: "Теорема Пифагора",
            url: "theorem-pythagoras.html",
            course: "1",
            difficulty: "basic",
            category: "geometry",
            tags: ["геометрия", "евклидова-геометрия", "треугольники"],
            description: "Фундаментальный результат евклидовой геометрии, связывающий стороны прямоугольного треугольника."
          }
        ]
      };
    }
  }

  async generateContentPage(pageType) {
    const pageData = {
      'integrals': {
        title: 'Интегралы',
        description: 'Раздел включает фундаментальные правила, справочные таблицы и комплексные примеры интегрирования.',
        sections: [
          { title: 'Неопределённые интегралы', desc: 'Определение, свойства, примеры вычислений', url: '/integrals-indefinite.html' },
          { title: 'Определённые интегралы', desc: 'Интеграл Римана, Ньютон-Лейбниц, приложения', url: '/integrals-definite.html' },
          { title: 'Методы интегрирования', desc: 'Замена переменной, по частям, разложение на дроби', url: '/integrals-methods.html' }
        ]
      },
      'derivatives': {
        title: 'Производные',
        description: 'Раздел включает фундаментальные правила, справочные таблицы и комплексные примеры дифференцирования.',
        sections: [
          { title: 'Правила дифференцирования', desc: 'Линейность, произведение, частное, цепное правило', url: '/derivatives-rules.html' },
          { title: 'Таблица производных', desc: 'Элементарные функции и комментарии к применению', url: '/derivatives-table.html' },
          { title: 'Сложные примеры', desc: 'Многошаговые задачи с подробным разбором', url: '/derivatives-examples.html' }
        ]
      },
      // Добавить другие страницы...
    };

    const data = pageData[pageType];
    if (!data) {
      return `<section class="hero"><h1>${pageType}</h1><p>Страница в разработке</p></section>`;
    }

    let content = `
      <section class="hero">
        <span class="tag">${pageType}</span>
        <h1>${data.title}</h1>
        <p>${data.description}</p>
      </section>
    `;

    if (data.sections) {
      content += '<section class="section"><div class="card-grid triple">';
      data.sections.forEach(section => {
        content += `
          <a class="glass-card card" href="${section.url}">
            <h3>${section.title}</h3>
            <p>${section.desc}</p>
          </a>
        `;
      });
      content += '</div></section>';
    }

    return content;
  }

  renderContent(content) {
    if (this.contentContainer) {
      this.contentContainer.innerHTML = content;
      
      // Инициализируем компоненты в новом контенте
      this.initializeComponents();
      
      // Обрабатываем якоря
      this.processAnchors();
    }
  }

  initializeComponents() {
    // Инициализация MathJax
    if (window.MathJax) {
      window.MathJax.typesetPromise([this.contentContainer]);
    }

    // Инициализация фильтров теорем
    if (window.mathLabApp && window.mathLabApp.modules.theorems) {
      window.mathLabApp.modules.theorems.init();
    }
  }

  processAnchors() {
    // Обрабатываем внутренние ссылки
    this.contentContainer.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const anchorId = link.getAttribute('href').slice(1);
        this.scrollToAnchor(anchorId);
      });
    });
  }

  updateActiveNavigation(path) {
    // Обновляем активную ссылку в навигации
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.removeAttribute('aria-current');
    });

    const activeLink = document.querySelector(`.nav-links a[href="${path}"]`);
    if (activeLink) {
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  updatePageTitle(path) {
    const titles = {
      '/': 'MathLab — Онлайн-справочник по математике',
      '/theorems.html': 'MathLab — Теоремы',
      '/integrals.html': 'MathLab — Интегралы',
      '/derivatives.html': 'MathLab — Производные',
      '/algebra.html': 'MathLab — Линейная алгебра',
      '/geometry-space.html': 'MathLab — Геометрия',
      '/probability-theory.html': 'MathLab — Теория вероятностей',
      '/statistics.html': 'MathLab — Статистика',
      '/differential-equations.html': 'MathLab — Дифференциальные уравнения',
      '/numerical-methods.html': 'MathLab — Численные методы',
      '/complex-analysis.html': 'MathLab — Комплексный анализ',
      '/discrete-mathematics.html': 'MathLab — Дискретная математика',
      '/about.html': 'MathLab — О проекте'
    };

    document.title = titles[path] || 'MathLab — Онлайн-справочник по математике';
  }

  showLoading() {
    if (this.contentContainer) {
      this.contentContainer.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      `;
    }
  }

  hideLoading() {
    // Загрузка скрывается автоматически при рендере контента
  }
}

export const router = new Router();

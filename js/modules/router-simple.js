import { CONFIG } from '../config.js';
import { appState } from '../state.js';

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.contentContainer = null;
    this.init();
  }

  init() {
    this.setupContentContainer();
    this.setupRoutes();
    this.setupEventListeners();
    this.handleInitialRoute();
  }

  setupContentContainer() {
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
    this.routes.set('/', () => this.loadHomePage());
    this.routes.set('/index.html', () => this.loadHomePage());
    this.routes.set('/theorems.html', () => this.loadTheoremsPage());
    this.routes.set('/integrals.html', () => this.loadIntegralsPage());
    this.routes.set('/derivatives.html', () => this.loadDerivativesPage());
    this.routes.set('/algebra.html', () => this.loadAlgebraPage());
    this.routes.set('/geometry-space.html', () => this.loadGeometryPage());
    this.routes.set('/probability-theory.html', () => this.loadProbabilityPage());
    this.routes.set('/statistics.html', () => this.loadStatisticsPage());
    this.routes.set('/differential-equations.html', () => this.loadDifferentialEquationsPage());
    this.routes.set('/numerical-methods.html', () => this.loadNumericalMethodsPage());
    this.routes.set('/complex-analysis.html', () => this.loadComplexAnalysisPage());
    this.routes.set('/discrete-mathematics.html', () => this.loadDiscreteMathematicsPage());
    this.routes.set('/about.html', () => this.loadAboutPage());
    this.routes.set('*', () => this.load404Page());
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && this.shouldInterceptLink(link)) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigate(href);
      }
    });

    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });

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

  navigate(path) {
    if (path.startsWith('#')) {
      this.scrollToAnchor(path.slice(1));
      return;
    }

    if (this.useHashRouting()) {
      const hash = path === '/' ? '#!/' : '#!' + path;
      window.location.hash = hash;
    } else {
      history.pushState({ route: path }, '', path);
      this.loadRoute(path);
    }
  }

  useHashRouting() {
    return window.location.hostname.includes('github.io') || 
           window.location.pathname.includes('/mathsite/');
  }

  async loadRoute(path, updateHistory = true) {
    if (this.currentRoute === path) return;

    try {
      this.showLoading();

      const route = this.findRoute(path);
      
      if (route) {
        this.currentRoute = path;
        await route.handler();
        this.updateActiveNavigation(path);
        this.updatePageTitle(path);
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
    if (this.routes.has(path)) {
      return { handler: this.routes.get(path), params: {} };
    }
    return { handler: this.routes.get('*'), params: {} };
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
      path = hash.slice(2);
      if (!path) path = '/';
    }
    
    this.loadRoute(path, false);
  }

  scrollToAnchor(anchorId) {
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async loadHomePage() {
    const content = `
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
    this.renderContent(content);
  }

  async loadTheoremsPage() {
    const content = `
      <section class="hero">
        <span class="tag">Раздел теорем</span>
        <h1>Теоремы с полным академическим изложением</h1>
        <p>Каждая теорема вынесена на отдельную страницу: строгая формулировка, доказательство, примеры и ссылки на видеоразборы МФТИ Study.</p>
      </section>

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

      <section class="section">
        <div class="card-grid triple" data-theorem-grid>
          <a class="glass-card card theorem-card" data-theorem-card data-courses="1" href="/theorem-pythagoras.html">
            <h3>Теорема Пифагора</h3>
            <p>Фундаментальный результат евклидовой геометрии, связывающий стороны прямоугольного треугольника.</p>
            <div class="theorem-tags">
              <span class="hash-tag">#геометрия</span>
              <span class="hash-tag">#евклидова-геометрия</span>
              <span class="hash-tag">#треугольники</span>
              <span class="hash-tag hash-tag-course" data-hash-course="1">#курс-1</span>
            </div>
          </a>
        </div>
      </section>
    `;
    this.renderContent(content);
  }

  async loadIntegralsPage() {
    const content = `
      <section class="hero">
        <span class="tag">Интегралы</span>
        <h1>Интегральное исчисление</h1>
        <p>Раздел включает фундаментальные правила, справочные таблицы и комплексные примеры интегрирования.</p>
      </section>

      <section class="section">
        <div class="card-grid triple">
          <a class="glass-card card" href="/integrals-indefinite.html">
            <h3>Неопределённые интегралы</h3>
            <p>Определение, свойства, примеры вычислений</p>
          </a>
          <a class="glass-card card" href="/integrals-definite.html">
            <h3>Определённые интегралы</h3>
            <p>Интеграл Римана, Ньютон-Лейбниц, приложения</p>
          </a>
          <a class="glass-card card" href="/integrals-methods.html">
            <h3>Методы интегрирования</h3>
            <p>Замена переменной, по частям, разложение на дроби</p>
          </a>
        </div>
      </section>
    `;
    this.renderContent(content);
  }

  async loadDerivativesPage() {
    const content = `
      <section class="hero">
        <span class="tag">Производные</span>
        <h1>Дифференциальное исчисление</h1>
        <p>Раздел включает фундаментальные правила, справочные таблицы и комплексные примеры дифференцирования.</p>
      </section>

      <section class="section">
        <div class="card-grid triple">
          <a class="glass-card card" href="/derivatives-rules.html">
            <h3>Правила дифференцирования</h3>
            <p>Линейность, произведение, частное, цепное правило</p>
          </a>
          <a class="glass-card card" href="/derivatives-table.html">
            <h3>Таблица производных</h3>
            <p>Элементарные функции и комментарии к применению</p>
          </a>
          <a class="glass-card card" href="/derivatives-examples.html">
            <h3>Сложные примеры</h3>
            <p>Многошаговые задачи с подробным разбором</p>
          </a>
        </div>
      </section>
    `;
    this.renderContent(content);
  }

  async loadAlgebraPage() {
    const content = `
      <section class="hero">
        <span class="tag">Линейная алгебра</span>
        <h1>Линейная алгебра и матричные вычисления</h1>
        <p>Матрицы, определители, системы линейных уравнений, векторные пространства.</p>
      </section>
    `;
    this.renderContent(content);
  }

  async loadGeometryPage() {
    const content = `
      <section class="hero">
        <span class="tag">Геометрия</span>
        <h1>Геометрия в пространстве</h1>
        <p>Прямые и плоскости в пространстве, параллельность и пересечение, углы и расстояния.</p>
      </section>
    `;
    this.renderContent(content);
  }

  async loadProbabilityPage() {
    const content = `
      <section class="hero">
        <span class="tag">Теория вероятностей</span>
        <h1>Теория вероятностей и случайные события</h1>
        <p>Фундаментальные концепции теории вероятностей: от классического определения до предельных теорем.</p>
      </section>
    `;
    this.renderContent(content);
  }

  async loadStatisticsPage() {
    const content = `
      <section class="hero">
        <span class="tag">Математическая статистика</span>
        <h1>Математическая статистика и анализ данных</h1>
        <p>Методы статистического анализа: от описательной статистики до регрессионного анализа.</p>
      </section>
    `;
    this.renderContent(content);
  }

  async loadDifferentialEquationsPage() {
    const content = `
      <section class="hero">
        <span class="tag">Дифференциальные уравнения</span>
        <h1>Дифференциальные уравнения и методы их решения</h1>
        <p>Теория и практика решения дифференциальных уравнений: от простых ОДУ до систем.</p>
      </section>
    `;
    this.renderContent(content);
  }

  async loadNumericalMethodsPage() {
    const content = `
      <section class="hero">
        <span class="tag">Численные методы</span>
        <h1>Численные методы и вычислительная математика</h1>
        <p>Практические методы решения математических задач: от решения уравнений до численного интегрирования.</p>
      </section>
    `;
    this.renderContent(content);
  }

  async loadComplexAnalysisPage() {
    const content = `
      <section class="hero">
        <span class="tag">Комплексный анализ</span>
        <h1>Комплексный анализ и функции комплексного переменного</h1>
        <p>Теория функций комплексного переменного: от основ комплексных чисел до конформных отображений.</p>
      </section>
    `;
    this.renderContent(content);
  }

  async loadDiscreteMathematicsPage() {
    const content = `
      <section class="hero">
        <span class="tag">Дискретная математика</span>
        <h1>Дискретная математика и её приложения</h1>
        <p>Основы дискретной математики: теория графов, комбинаторика, теория кодирования.</p>
      </section>
    `;
    this.renderContent(content);
  }

  async loadAboutPage() {
    const content = `
      <section class="hero">
        <span class="tag">О проекте</span>
        <h1>MathLab — академичный справочник по математике</h1>
        <p>Структурированный математический справочник для студентов 1–4 курсов.</p>
      </section>
    `;
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

  renderContent(content) {
    if (this.contentContainer) {
      this.contentContainer.innerHTML = content;
      this.initializeComponents();
      this.processAnchors();
    }
  }

  initializeComponents() {
    if (window.MathJax) {
      window.MathJax.typesetPromise([this.contentContainer]);
    }
  }

  processAnchors() {
    this.contentContainer.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const anchorId = link.getAttribute('href').slice(1);
        this.scrollToAnchor(anchorId);
      });
    });
  }

  updateActiveNavigation(path) {
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

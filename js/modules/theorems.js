import { appState } from '../state.js';

export class TheoremManager {
  constructor() {
    this.theoremGrid = document.querySelector('[data-theorem-grid]');
    this.filterRoot = document.querySelector('[data-course-filter]');
    this.filterStatus = document.querySelector('[data-filter-status]');
    this.theorems = [];
    this.init();
  }

  init() {
    this.loadTheorems();
    this.renderTheoremCatalog();
    this.initFilters();
  }

  loadTheorems() {
    // Загружаем теоремы из глобальной переменной (временно)
    if (typeof THEOREM_CATALOG !== 'undefined') {
      this.theorems = THEOREM_CATALOG;
    }
  }

  renderTheoremCatalog() {
    if (!this.theoremGrid) return;

    const sorted = [...this.theorems].sort((a, b) => 
      Number(a.course) - Number(b.course) || a.title.localeCompare(b.title, 'ru')
    );

    this.theoremGrid.innerHTML = sorted.map((item) => {
      const tags = item.tags.map((tag) => `<span class="hash-tag">#${tag}</span>`).join('');
      return `
        <a class="glass-card card theorem-card" data-theorem-card data-courses="${item.course}" href="${item.url}">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="theorem-tags">
            ${tags}
            <span class="hash-tag hash-tag-course" data-hash-course="${item.course}">#курс-${item.course}</span>
          </div>
        </a>
      `;
    }).join('');
  }

  applyCourseFilter(course) {
    const theoremCards = document.querySelectorAll('[data-theorem-card]');
    const filterButtons = document.querySelectorAll('[data-course-filter] [data-course]');

    if (!theoremCards.length || !filterButtons.length) return;

    let visibleCount = 0;

    theoremCards.forEach((card) => {
      const cardCourses = (card.getAttribute('data-courses') || '').split(',').map((item) => item.trim()).filter(Boolean);
      const isVisible = course === 'all' || cardCourses.includes(course);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    // Обновляем состояние кнопок
    filterButtons.forEach((button) => {
      const isActive = button.getAttribute('data-course') === course;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    // Обновляем статус
    if (this.filterStatus) {
      if (course === 'all') {
        this.filterStatus.textContent = `Показаны все теоремы: ${visibleCount}.`;
      } else {
        this.filterStatus.textContent = `Показаны теоремы для ${course} курса: ${visibleCount}.`;
      }
    }

    // Сохраняем фильтр в состоянии
    appState.filters.course = course;
  }

  resolveCourseFromHash() {
    const normalizedHash = window.location.hash.toLowerCase();
    const match = normalizedHash.match(/#course-(all|[1-4])/);
    return match ? match[1] : 'all';
  }

  initFilters() {
    if (!this.filterRoot) return;

    const filterButtons = this.filterRoot.querySelectorAll('[data-course]');
    if (!filterButtons.length) return;

    const setCourse = (course, shouldReplaceHash = false) => {
      this.applyCourseFilter(course);
      const nextHash = course === 'all' ? '' : `#course-${course}`;
      
      if (shouldReplaceHash) {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
      } else if (window.location.hash !== nextHash) {
        window.location.hash = nextHash;
      }
    };

    // Обработчики для кнопок фильтра
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const course = button.getAttribute('data-course') || 'all';
        setCourse(course);
      });
    });

    // Обработчики для хештегов
    document.querySelectorAll('[data-hash-course]').forEach((tag) => {
      tag.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const course = tag.getAttribute('data-hash-course') || 'all';
        setCourse(course);
      });
    });

    // Применяем фильтр из хеша
    const initialCourse = this.resolveCourseFromHash();
    this.applyCourseFilter(initialCourse);

    // Следим за изменениями хеша
    window.addEventListener('hashchange', () => {
      this.applyCourseFilter(this.resolveCourseFromHash());
    });
  }
}

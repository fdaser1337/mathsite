import { CONFIG } from '../config.js';
import { appState } from '../state.js';

export class SearchManager {
  constructor() {
    this.searchInput = document.querySelector('[data-search-input]');
    this.searchBtn = document.querySelector('[data-search-btn]');
    this.searchResults = document.querySelector('[data-search-results]');
    this.searchIndex = [];
    this.init();
  }

  init() {
    this.buildSearchIndex();
    this.bindEvents();
    this.loadSearchHistory();
  }

  buildSearchIndex() {
    // Базовый индекс из main.js
    this.searchIndex = [
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
      { title: 'Математическая статистика', text: 'Выборки, оценки, гипотезы, регрессия', url: 'statistics.html' },
      { title: 'Дифференциальные уравнения', text: 'ОДУ, системы, методы решения', url: 'differential-equations.html' },
      { title: 'Численные методы', text: 'Интерполяция, аппроксимация, численное интегрирование', url: 'numerical-methods.html' },
      { title: 'Комплексный анализ', text: 'Функции комплексного переменного, конформные отображения', url: 'complex-analysis.html' },
      { title: 'Дискретная математика', text: 'Графы, комбинаторика, теория кодирования', url: 'discrete-mathematics.html' }
    ];
  }

  performSearch(query = null) {
    const searchQuery = query || this.searchInput?.value?.trim()?.toLowerCase();
    
    if (!searchQuery) {
      this.hideResults();
      return;
    }

    appState.addToSearchHistory(searchQuery);

    const results = this.searchIndex.filter((item) => {
      const searchText = `${item.title} ${item.text}`.toLowerCase();
      return searchText.includes(searchQuery);
    }).slice(0, CONFIG.SEARCH_LIMIT);

    this.renderResults(results, searchQuery);
  }

  renderResults(results, query) {
    if (!this.searchResults) return;

    if (!results.length) {
      this.searchResults.classList.add('active');
      this.searchResults.innerHTML = '<p>Ничего не найдено. Попробуйте другой термин.</p>';
      return;
    }

    const list = results.map((result) => `
      <li>
        <a href="${result.url}">
          <strong>${this.highlightQuery(result.title, query)}</strong><br>
          <small>${this.highlightQuery(result.text, query)}</small>
        </a>
      </li>
    `).join('');

    this.searchResults.classList.add('active');
    this.searchResults.innerHTML = `<ul>${list}</ul>`;
  }

  highlightQuery(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  hideResults() {
    if (this.searchResults) {
      this.searchResults.classList.remove('active');
      this.searchResults.innerHTML = '';
    }
  }

  loadSearchHistory() {
    if (this.searchInput && appState.searchHistory.length > 0) {
      this.searchInput.placeholder = `Поиск (последний: ${appState.searchHistory[0]})`;
    }
  }

  bindEvents() {
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => this.performSearch());
    }

    if (this.searchInput) {
      // Debounced search
      let debounceTimer;
      this.searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => this.performSearch(), CONFIG.UI.DEBOUNCE_DELAY);
      });

      this.searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this.performSearch();
        }
        if (event.key === 'Escape') {
          this.hideResults();
        }
      });
    }

    // Закрытие результатов при клике вне
    document.addEventListener('click', (event) => {
      if (!this.searchResults) return;
      if (!event.target.closest('.search-host')) {
        this.hideResults();
      }
    });
  }
}

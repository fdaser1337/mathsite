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
    
    if (results.length === 0) {
      this.searchResults.innerHTML = `
        <div class="search-empty">
          <p>Ничего не найдено по запросу «${query}»</p>
        </div>
      `;
      this.showResults();
      return;
    }

    const resultsHtml = results.map(result => {
      const highlightedTitle = this.highlightText(result.title, query);
      const highlightedText = this.highlightText(result.text, query);
      
      return `
        <li>
          <a href="${result.url}" onclick="window.location.hash='!${result.url}'; return false;">
            <strong>${highlightedTitle}</strong>
            <br>
            <small>${highlightedText}</small>
          </a>
        </li>
      `;
    }).join('');

    this.searchResults.innerHTML = `<ul>${resultsHtml}</ul>`;
    this.showResults();
  }

  highlightText(text, query) {
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
    if (!this.searchInput || !this.searchBtn) {
      console.warn('Search elements not found');
      return;
    }

    // Поиск при вводе с дебаунс
    let searchTimeout;
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length >= 2) {
        searchTimeout = setTimeout(() => {
          this.performSearch(query);
        }, CONFIG.SEARCH_DEBOUNCE_DELAY);
      } else {
        this.hideResults();
      }
    });

    // Поиск по клику на кнопку
    this.searchBtn.addEventListener('click', () => {
      const query = this.searchInput.value.trim();
      if (query) {
        this.performSearch(query);
      }
    });

    // Закрытие результатов при клике вне поля
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-host')) {
        this.hideResults();
      }
    });

    // Навигация с клавиатуры
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideResults();
        this.searchInput.blur();
      }
    });
  }
}

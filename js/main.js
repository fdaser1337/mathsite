const SEARCH_INDEX = [
  { title: 'Теорема Пифагора', text: 'Связь сторон прямоугольного треугольника', url: 'theorems.html#pythagoras' },
  { title: 'Теорема Ферма', text: 'Невозможность уравнения x^n + y^n = z^n при n>2', url: 'theorems.html#fermat' },
  { title: 'Больцано–Вейерштрасса', text: 'Ограниченная последовательность имеет сходящуюся подпоследовательность', url: 'theorems.html#bolzano' },
  { title: 'Неопределённые интегралы', text: 'Базовые формулы и техники интегрирования', url: 'integrals.html#indefinite' },
  { title: 'Определённые интегралы', text: 'Интеграл Римана и формула Ньютона-Лейбница', url: 'integrals.html#definite' },
  { title: 'Правила дифференцирования', text: 'Линейность, произведение, частное, цепное правило', url: 'derivatives.html#rules' },
  { title: 'Таблица производных', text: 'Стандартные производные элементарных функций', url: 'derivatives.html#table' },
  { title: 'Матрицы', text: 'Операции с матрицами и применение', url: 'algebra.html#matrices' },
  { title: 'Определители', text: 'Свойства и вычисление детерминанта', url: 'algebra.html#determinants' },
  { title: 'Системы уравнений', text: 'Метод Гаусса и матричный подход', url: 'algebra.html#systems' }
];

const body = document.body;
const toggleBtn = document.querySelector('[data-theme-toggle]');
const searchInput = document.querySelector('[data-search-input]');
const searchBtn = document.querySelector('[data-search-btn]');
const searchResults = document.querySelector('[data-search-results]');
const currentYear = document.querySelector('[data-current-year]');

function setTheme(theme) {
  body.setAttribute('data-theme', theme);
  localStorage.setItem('mathlab-theme', theme);
  if (toggleBtn) {
    toggleBtn.textContent = theme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная';
  }
}

function initTheme() {
  const saved = localStorage.getItem('mathlab-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (systemDark ? 'dark' : 'light'));
}

function renderResults(results, query) {
  if (!searchResults) return;

  if (!query) {
    searchResults.classList.remove('active');
    searchResults.innerHTML = '';
    return;
  }

  if (!results.length) {
    searchResults.classList.add('active');
    searchResults.innerHTML = '<p>Ничего не найдено. Попробуйте уточнить запрос.</p>';
    return;
  }

  const list = results
    .map((result) => `
      <li>
        <a href="${result.url}">
          <strong>${result.title}</strong><br>
          <small>${result.text}</small>
        </a>
      </li>
    `)
    .join('');

  searchResults.classList.add('active');
  searchResults.innerHTML = `<ul>${list}</ul>`;
}

function performSearch() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  const results = SEARCH_INDEX.filter((item) => {
    const haystack = `${item.title} ${item.text}`.toLowerCase();
    return haystack.includes(query);
  }).slice(0, 7);

  renderResults(results, query);
}

function initSearch() {
  if (!searchInput || !searchBtn) return;

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('input', performSearch);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performSearch();
    }
  });

  document.addEventListener('click', (event) => {
    if (!searchResults) return;
    const inside = event.target.closest('.search-host');
    if (!inside) {
      searchResults.classList.remove('active');
    }
  });
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const nextTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

if (currentYear) currentYear.textContent = new Date().getFullYear();

initTheme();
initSearch();

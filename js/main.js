const SEARCH_INDEX = [
  { title: 'Главная: MathLab', text: 'Онлайн-справочник по математике для студентов', url: 'index.html' },
  { title: 'О проекте MathLab', text: 'Документация проекта и маршрут по курсам 1–4', url: 'about.html' },

  { title: 'Теоремы: обзор', text: 'Каталог теорем с переходом на отдельные страницы', url: 'theorems.html' },
  { title: 'Теорема Пифагора', text: 'Полная формулировка, доказательство и применение', url: 'theorem-pythagoras.html' },
  { title: 'Великая теорема Ферма', text: 'Формулировка, исторический контекст и значение', url: 'theorem-fermat.html' },
  { title: 'Теорема Больцано–Вейерштрасса', text: 'Компактность, предельные переходы и сходимость', url: 'theorem-bolzano-weierstrass.html' },
  { title: 'Теорема Кэли–Гамильтона', text: 'Матрицы и характеристический многочлен', url: 'theorem-cayley-hamilton.html' },
  { title: 'Теорема Лагранжа', text: 'Теорема о среднем значении', url: 'theorem-mean-value.html' },
  { title: 'Теорема Гаусса–Остроградского', text: 'Поток через поверхность и дивергенция', url: 'theorem-gauss-divergence.html' },

  { title: 'Интегралы: обзор', text: 'Разделы и ссылки на подробную теорию', url: 'integrals.html' },
  { title: 'Неопределённые интегралы', text: 'Определение, свойства, примеры вычислений', url: 'integrals-indefinite.html' },
  { title: 'Определённые интегралы', text: 'Интеграл Римана, Ньютон-Лейбниц, приложения', url: 'integrals-definite.html' },
  { title: 'Методы интегрирования', text: 'Замена переменной, по частям, разложение на дроби', url: 'integrals-methods.html' },

  { title: 'Производные: обзор', text: 'Структура раздела и подробные материалы', url: 'derivatives.html' },
  { title: 'Правила дифференцирования', text: 'Линейность, произведение, частное, цепное правило', url: 'derivatives-rules.html' },
  { title: 'Таблица производных', text: 'Элементарные функции и комментарии к применению', url: 'derivatives-table.html' },
  { title: 'Сложные примеры по производным', text: 'Многошаговые задачи с подробным разбором', url: 'derivatives-examples.html' },

  { title: 'Линейная алгебра', text: 'Матрицы, определители, системы уравнений', url: 'algebra.html' },
  { title: 'Геометрия в пространстве', text: 'Прямые и плоскости, параллельность и пересечение', url: 'geometry-space.html' }
];


const THEOREM_TAGS = [
  { title: 'Теорема Пифагора', url: 'theorem-pythagoras.html', section: 'геометрия', course: 1 },
  { title: 'Теорема Больцано–Вейерштрасса', url: 'theorem-bolzano-weierstrass.html', section: 'анализ', course: 2 },
  { title: 'Теорема Лагранжа (о среднем)', url: 'theorem-mean-value.html', section: 'производные', course: 2 },
  { title: 'Теорема Кэли–Гамильтона', url: 'theorem-cayley-hamilton.html', section: 'линейная алгебра', course: 3 },
  { title: 'Теорема Гаусса–Остроградского', url: 'theorem-gauss-divergence.html', section: 'интегралы', course: 3 },
  { title: 'Великая теорема Ферма', url: 'theorem-fermat.html', section: 'алгебра', course: 4 }
];

function renderCourseTheorems(course) {
  const target = document.querySelector('[data-course-list]');
  if (!target) return;

  const filtered = THEOREM_TAGS.filter((item) => item.course === course);
  if (!filtered.length) {
    target.innerHTML = '<p>Для этого курса пока нет теорем в каталоге.</p>';
    return;
  }

  target.innerHTML = filtered.map((item) => `
    <a class="course-theorem-item" href="${item.url}">
      <h4>${item.title}</h4>
      <div class="hashtag-list">
        <span class="hashtag">#${item.section.replace(' ', '')}</span>
        <span class="hashtag">#${item.course}курс</span>
      </div>
    </a>
  `).join('');
}

function initCourseFilters() {
  const buttons = Array.from(document.querySelectorAll('[data-course-filter]'));
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const course = Number(button.dataset.courseFilter);
      buttons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      renderCourseTheorems(course);
    });
  });

  buttons[0].classList.add('active');
  renderCourseTheorems(Number(buttons[0].dataset.courseFilter));
}

const body = document.body;
const toggleBtn = document.querySelector('[data-theme-toggle]');
const searchInput = document.querySelector('[data-search-input]');
const searchBtn = document.querySelector('[data-search-btn]');
const searchResults = document.querySelector('[data-search-results]');
const currentYear = document.querySelector('[data-current-year]');

function setTheme(theme) {
  body.setAttribute('data-theme', theme);
  localStorage.setItem('mathlab-theme', theme);
  if (toggleBtn) toggleBtn.textContent = theme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная';
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
    searchResults.innerHTML = '<p>Ничего не найдено. Попробуйте другой термин.</p>';
    return;
  }

  const list = results.map((result) => `
    <li>
      <a href="${result.url}">
        <strong>${result.title}</strong><br>
        <small>${result.text}</small>
      </a>
    </li>
  `).join('');

  searchResults.classList.add('active');
  searchResults.innerHTML = `<ul>${list}</ul>`;
}

function performSearch() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  const results = SEARCH_INDEX.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(query)).slice(0, 10);
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
    if (!event.target.closest('.search-host')) searchResults.classList.remove('active');
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
initCourseFilters();

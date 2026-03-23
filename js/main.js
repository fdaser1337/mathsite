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
  { title: 'Геометрия в пространстве', text: 'Прямые и плоскости, параллельность и пересечение', url: 'geometry-space.html' }
];

const THEOREM_CATALOG = [
  {
    "title": "Теорема Больцано-Коши о промежуточном значении",
    "url": "theorems/theorem-bolzano-cauchy-intermediate.html",
    "course": "1",
    "tags": [
      "матанализ",
      "последовательности"
    ],
    "description": "Фундаментальный результат: Теорема Больцано-Коши о промежуточном значении"
  },
  {
    "title": "Теорема Больцано–Вейерштрасса",
    "url": "theorems/theorem-bolzano-weierstrass.html",
    "course": "2",
    "tags": [
      "многомерный-анализ",
      "матанализ"
    ],
    "description": "Фундаментальный результат: Теорема Больцано–Вейерштрасса"
  },
  {
    "title": "Лемма Бореля—Кантелли",
    "url": "theorems/theorem-borel-cantelli.html",
    "course": "3",
    "tags": [
      "вероятность",
      "почти-верная-сходимость"
    ],
    "description": "Фундаментальный результат: Лемма Бореля—Кантелли"
  },
  {
    "title": "Критерий Коши для сходимости последовательности",
    "url": "theorems/theorem-cauchy-criterion-sequence.html",
    "course": "1",
    "tags": [
      "матанализ",
      "последовательности"
    ],
    "description": "Фундаментальный результат: Критерий Коши для сходимости последовательности"
  },
  {
    "title": "Интегральная формула Коши",
    "url": "theorems/theorem-cauchy-integral-formula.html",
    "course": "3",
    "tags": [
      "комплексный-анализ",
      "голоморфные-функции"
    ],
    "description": "Фундаментальный результат: Интегральная формула Коши"
  },
  {
    "title": "Теорема Кэли–Гамильтона",
    "url": "theorems/theorem-cayley-hamilton.html",
    "course": "3",
    "tags": [
      "линейная-алгебра",
      "матрицы"
    ],
    "description": "Фундаментальный результат: Теорема Кэли–Гамильтона"
  },
  {
    "title": "Центральная предельная теорема",
    "url": "theorems/theorem-central-limit.html",
    "course": "3",
    "tags": [
      "вероятность",
      "предельные-теоремы"
    ],
    "description": "Фундаментальный результат: Центральная предельная теорема"
  },
  {
    "title": "Теорема о замене переменных в кратном интеграле",
    "url": "theorems/theorem-change-of-variables-multiple-integral.html",
    "course": "2",
    "tags": [
      "кратные-интегралы",
      "якобиан"
    ],
    "description": "Фундаментальный результат: Теорема о замене переменных в кратном интеграле"
  },
  {
    "title": "Теорема Шевалле—Уорнинга",
    "url": "theorems/theorem-chevalley-warning.html",
    "course": "4",
    "tags": [
      "алгебра",
      "конечные-поля"
    ],
    "description": "Фундаментальный результат: Теорема Шевалле—Уорнинга"
  },
  {
    "title": "Китайская теорема об остатках",
    "url": "theorems/theorem-chinese-remainder.html",
    "course": "4",
    "tags": [
      "абстрактная-алгебра",
      "кольца"
    ],
    "description": "Фундаментальный результат: Китайская теорема об остатках"
  },
  {
    "title": "Компакт Хаусдорфа нормален",
    "url": "theorems/theorem-compact-hausdorff-normal.html",
    "course": "4",
    "tags": [
      "топология",
      "компактность"
    ],
    "description": "Фундаментальный результат: Компакт Хаусдорфа нормален"
  },
  {
    "title": "Теорема Дирихле о простых в арифметических прогрессиях",
    "url": "theorems/theorem-dirichlet-arithmetic-progressions.html",
    "course": "4",
    "tags": [
      "теория-чисел",
      "простые-числа"
    ],
    "description": "Фундаментальный результат: Теорема Дирихле о простых в арифметических прогрессиях"
  },
  {
    "title": "Теорема Лебега о мажорируемой сходимости",
    "url": "theorems/theorem-dominated-convergence.html",
    "course": "3",
    "tags": [
      "теория-меры",
      "интеграл-лебега"
    ],
    "description": "Фундаментальный результат: Теорема Лебега о мажорируемой сходимости"
  },
  {
    "title": "Критерий Эйлера",
    "url": "theorems/theorem-euler-criterion.html",
    "course": "4",
    "tags": [
      "теория-чисел",
      "сравнения"
    ],
    "description": "Фундаментальный результат: Критерий Эйлера"
  },
  {
    "title": "Теорема о линейной системе ОДУ",
    "url": "theorems/theorem-existence-linear-ode-system.html",
    "course": "2",
    "tags": [
      "диффуры",
      "линейные-системы"
    ],
    "description": "Фундаментальный результат: Теорема о линейной системе ОДУ"
  },
  {
    "title": "Лемма Фату",
    "url": "theorems/theorem-fatou-lemma.html",
    "course": "3",
    "tags": [
      "теория-меры",
      "интеграл-лебега"
    ],
    "description": "Фундаментальный результат: Лемма Фату"
  },
  {
    "title": "Великая теорема Ферма",
    "url": "theorems/theorem-fermat.html",
    "course": "4",
    "tags": [
      "теория-чисел",
      "диофантовы-уравнения"
    ],
    "description": "Фундаментальный результат: Великая теорема Ферма"
  },
  {
    "title": "Первая теорема об изоморфизме групп",
    "url": "theorems/theorem-first-isomorphism-group.html",
    "course": "4",
    "tags": [
      "абстрактная-алгебра",
      "теория-групп"
    ],
    "description": "Фундаментальный результат: Первая теорема об изоморфизме групп"
  },
  {
    "title": "Теорема Тонелли",
    "url": "theorems/theorem-fubini-tonelli.html",
    "course": "3",
    "tags": [
      "теория-меры",
      "произведение-мер"
    ],
    "description": "Фундаментальный результат: Теорема Тонелли"
  },
  {
    "title": "Теорема Фубини",
    "url": "theorems/theorem-fubini.html",
    "course": "2",
    "tags": [
      "кратные-интегралы",
      "мера"
    ],
    "description": "Фундаментальный результат: Теорема Фубини"
  },
  {
    "title": "Основная теорема теории Галуа",
    "url": "theorems/theorem-fundamental-galois-theory.html",
    "course": "4",
    "tags": [
      "теория-галуа",
      "алгебра"
    ],
    "description": "Фундаментальный результат: Основная теорема теории Галуа"
  },
  {
    "title": "Основная теорема теории пространственных кривых",
    "url": "theorems/theorem-fundamental-theorem-space-curves.html",
    "course": "4",
    "tags": [
      "диффгеометрия",
      "кривые"
    ],
    "description": "Фундаментальный результат: Основная теорема теории пространственных кривых"
  },
  {
    "title": "Критерий разрешимости в радикалах",
    "url": "theorems/theorem-galois-solvability.html",
    "course": "4",
    "tags": [
      "теория-галуа",
      "группы"
    ],
    "description": "Фундаментальный результат: Критерий разрешимости в радикалах"
  },
  {
    "title": "Теорема Гаусса—Бонне",
    "url": "theorems/theorem-gauss-bonnet.html",
    "course": "4",
    "tags": [
      "диффгеометрия",
      "кривизна"
    ],
    "description": "Фундаментальный результат: Теорема Гаусса—Бонне"
  },
  {
    "title": "Теорема Гаусса–Остроградского",
    "url": "theorems/theorem-gauss-divergence.html",
    "course": "2",
    "tags": [
      "векторный-анализ",
      "интегралы"
    ],
    "description": "Фундаментальный результат: Теорема Гаусса–Остроградского"
  },
  {
    "title": "Теорема Грина",
    "url": "theorems/theorem-green.html",
    "course": "2",
    "tags": [
      "векторный-анализ",
      "интегралы"
    ],
    "description": "Фундаментальный результат: Теорема Грина"
  },
  {
    "title": "Неравенство Гронуолла",
    "url": "theorems/theorem-gronwall.html",
    "course": "2",
    "tags": [
      "диффуры",
      "оценки"
    ],
    "description": "Фундаментальный результат: Неравенство Гронуолла"
  },
  {
    "title": "Теорема Хана—Банаха",
    "url": "theorems/theorem-hahn-banach.html",
    "course": "3",
    "tags": [
      "функциональный-анализ",
      "банаховы-пространства"
    ],
    "description": "Фундаментальный результат: Теорема Хана—Банаха"
  },
  {
    "title": "Теорема Гейне—Кантора",
    "url": "theorems/theorem-heine-cantor.html",
    "course": "1",
    "tags": [
      "матанализ",
      "последовательности"
    ],
    "description": "Фундаментальный результат: Теорема Гейне—Кантора"
  },
  {
    "title": "Теорема о проекции в гильбертовом пространстве",
    "url": "theorems/theorem-hilbert-projection.html",
    "course": "3",
    "tags": [
      "функциональный-анализ",
      "гильбертовы-пространства"
    ],
    "description": "Фундаментальный результат: Теорема о проекции в гильбертовом пространстве"
  },
  {
    "title": "Теорема Хопфа—Ринова",
    "url": "theorems/theorem-hopf-rinow.html",
    "course": "4",
    "tags": [
      "диффгеометрия",
      "риманова-геометрия"
    ],
    "description": "Фундаментальный результат: Теорема Хопфа—Ринова"
  },
  {
    "title": "Теорема о неявной функции",
    "url": "theorems/theorem-implicit-function.html",
    "course": "2",
    "tags": [
      "многомерный-анализ",
      "матанализ"
    ],
    "description": "Фундаментальный результат: Теорема о неявной функции"
  },
  {
    "title": "Теорема об обратной функции",
    "url": "theorems/theorem-inverse-function.html",
    "course": "2",
    "tags": [
      "многомерный-анализ",
      "матанализ"
    ],
    "description": "Фундаментальный результат: Теорема об обратной функции"
  },
  {
    "title": "Критерий обратимости матрицы",
    "url": "theorems/theorem-invertible-matrix.html",
    "course": "1",
    "tags": [
      "линейная-алгебра",
      "матрицы"
    ],
    "description": "Фундаментальный результат: Критерий обратимости матрицы"
  },
  {
    "title": "Теорема Жордана—Гёльдера",
    "url": "theorems/theorem-jordan-holder.html",
    "course": "4",
    "tags": [
      "абстрактная-алгебра",
      "теория-групп"
    ],
    "description": "Фундаментальный результат: Теорема Жордана—Гёльдера"
  },
  {
    "title": "Теорема Лагранжа (группы)",
    "url": "theorems/theorem-lagrange-group.html",
    "course": "4",
    "tags": [
      "абстрактная-алгебра",
      "теория-групп"
    ],
    "description": "Фундаментальный результат: Теорема Лагранжа (группы)"
  },
  {
    "title": "Закон больших чисел",
    "url": "theorems/theorem-law-large-numbers.html",
    "course": "3",
    "tags": [
      "вероятность",
      "сходимость"
    ],
    "description": "Фундаментальный результат: Закон больших чисел"
  },
  {
    "title": "Правило Лопиталя",
    "url": "theorems/theorem-lhopital.html",
    "course": "1",
    "tags": [
      "матанализ",
      "последовательности"
    ],
    "description": "Фундаментальный результат: Правило Лопиталя"
  },
  {
    "title": "Теорема Лиувилля",
    "url": "theorems/theorem-liouville.html",
    "course": "3",
    "tags": [
      "комплексный-анализ",
      "голоморфные-функции"
    ],
    "description": "Фундаментальный результат: Теорема Лиувилля"
  },
  {
    "title": "Принцип максимума модуля",
    "url": "theorems/theorem-maximum-modulus.html",
    "course": "3",
    "tags": [
      "комплексный-анализ",
      "голоморфные-функции"
    ],
    "description": "Фундаментальный результат: Принцип максимума модуля"
  },
  {
    "title": "Теорема Лагранжа о среднем",
    "url": "theorems/theorem-mean-value.html",
    "course": "2",
    "tags": [
      "многомерный-анализ",
      "матанализ"
    ],
    "description": "Фундаментальный результат: Теорема Лагранжа о среднем"
  },
  {
    "title": "Теорема Беппо Леви",
    "url": "theorems/theorem-monotone-convergence-beppo-levi.html",
    "course": "3",
    "tags": [
      "теория-меры",
      "интеграл-лебега"
    ],
    "description": "Фундаментальный результат: Теорема Беппо Леви"
  },
  {
    "title": "Теорема о монотонной сходимости последовательности",
    "url": "theorems/theorem-monotone-convergence-sequence.html",
    "course": "1",
    "tags": [
      "матанализ",
      "последовательности"
    ],
    "description": "Фундаментальный результат: Теорема о монотонной сходимости последовательности"
  },
  {
    "title": "Теорема об открытом отображении",
    "url": "theorems/theorem-open-mapping.html",
    "course": "3",
    "tags": [
      "функциональный-анализ",
      "банаховы-пространства"
    ],
    "description": "Фундаментальный результат: Теорема об открытом отображении"
  },
  {
    "title": "Теорема Пикара—Линделёфа",
    "url": "theorems/theorem-picard-lindelof.html",
    "course": "2",
    "tags": [
      "диффуры",
      "задача-коши"
    ],
    "description": "Фундаментальный результат: Теорема Пикара—Линделёфа"
  },
  {
    "title": "Критерий потенциальности поля",
    "url": "theorems/theorem-potential-field-criterion.html",
    "course": "2",
    "tags": [
      "многомерный-анализ",
      "матанализ"
    ],
    "description": "Фундаментальный результат: Критерий потенциальности поля"
  },
  {
    "title": "Теорема Пифагора",
    "url": "theorems/theorem-pythagoras.html",
    "course": "1",
    "tags": [
      "геометрия",
      "евклидова-геометрия"
    ],
    "description": "Фундаментальный результат: Теорема Пифагора"
  },
  {
    "title": "Закон квадратичной взаимности",
    "url": "theorems/theorem-quadratic-reciprocity.html",
    "course": "4",
    "tags": [
      "теория-чисел",
      "квадратичные-вычеты"
    ],
    "description": "Фундаментальный результат: Закон квадратичной взаимности"
  },
  {
    "title": "Теорема Радона—Никодима",
    "url": "theorems/theorem-radon-nikodym.html",
    "course": "3",
    "tags": [
      "теория-меры",
      "радон-никодим"
    ],
    "description": "Фундаментальный результат: Теорема Радона—Никодима"
  },
  {
    "title": "Теорема о ранге и дефекте",
    "url": "theorems/theorem-rank-nullity.html",
    "course": "1",
    "tags": [
      "линейная-алгебра",
      "матрицы"
    ],
    "description": "Фундаментальный результат: Теорема о ранге и дефекте"
  },
  {
    "title": "Теорема о вычетах",
    "url": "theorems/theorem-residue.html",
    "course": "3",
    "tags": [
      "комплексный-анализ",
      "вычеты"
    ],
    "description": "Фундаментальный результат: Теорема о вычетах"
  },
  {
    "title": "Критерий интегрируемости Римана",
    "url": "theorems/theorem-riemann-criterion-integrability.html",
    "course": "1",
    "tags": [
      "матанализ",
      "последовательности"
    ],
    "description": "Фундаментальный результат: Критерий интегрируемости Римана"
  },
  {
    "title": "Спектральная теорема для симметрических матриц",
    "url": "theorems/theorem-spectral-symmetric-matrix.html",
    "course": "1",
    "tags": [
      "линейная-алгебра",
      "спектральная-теория"
    ],
    "description": "Фундаментальный результат: Спектральная теорема для симметрических матриц"
  },
  {
    "title": "Теорема Стокса",
    "url": "theorems/theorem-stokes.html",
    "course": "2",
    "tags": [
      "векторный-анализ",
      "дифференциальные-формы"
    ],
    "description": "Фундаментальный результат: Теорема Стокса"
  },
  {
    "title": "Теоремы Силова",
    "url": "theorems/theorem-sylow.html",
    "course": "4",
    "tags": [
      "абстрактная-алгебра",
      "теория-групп"
    ],
    "description": "Фундаментальный результат: Теоремы Силова"
  },
  {
    "title": "Формула Тейлора с остатком Лагранжа",
    "url": "theorems/theorem-taylor-with-remainder-lagrange.html",
    "course": "1",
    "tags": [
      "матанализ",
      "последовательности"
    ],
    "description": "Фундаментальный результат: Формула Тейлора с остатком Лагранжа"
  },
  {
    "title": "Теорема Тихонова",
    "url": "theorems/theorem-tychonoff.html",
    "course": "4",
    "tags": [
      "топология",
      "компактность"
    ],
    "description": "Фундаментальный результат: Теорема Тихонова"
  },
  {
    "title": "Единственность разложения в PID",
    "url": "theorems/theorem-uft-pid.html",
    "course": "4",
    "tags": [
      "абстрактная-алгебра",
      "кольца"
    ],
    "description": "Фундаментальный результат: Единственность разложения в PID"
  },
  {
    "title": "Принцип равномерной ограниченности",
    "url": "theorems/theorem-uniform-boundedness.html",
    "course": "3",
    "tags": [
      "функциональный-анализ",
      "банаховы-пространства"
    ],
    "description": "Фундаментальный результат: Принцип равномерной ограниченности"
  },
  {
    "title": "Лемма Урысона",
    "url": "theorems/theorem-urysohn-lemma.html",
    "course": "4",
    "tags": [
      "топология",
      "нормальность"
    ],
    "description": "Фундаментальный результат: Лемма Урысона"
  },
  {
    "title": "Теорема Вейерштрасса о достижении экстремумов",
    "url": "theorems/theorem-weierstrass-extreme-value.html",
    "course": "1",
    "tags": [
      "матанализ",
      "последовательности"
    ],
    "description": "Фундаментальный результат: Теорема Вейерштрасса о достижении экстремумов"
  }
];

const SEARCH_INDEX = [
  ...BASE_SEARCH_INDEX,
  ...THEOREM_CATALOG.map((item) => ({
    title: item.title,
    text: `Курс ${item.course} · ${item.tags.map((tag) => `#${tag}`).join(' ')}`,
    url: item.url
  }))
];


function resolveInternalUrl(url) {
  if (!url || /^(?:[a-z][a-z0-9+.-]*:|#)/i.test(url)) return url;
  const inTheoremDir = window.location.pathname.includes('/theorems/');
  if (!inTheoremDir) return url;
  if (url.startsWith('../') || url.startsWith('./')) return url;
  return `../${url}`;
}

function renderTheoremCatalog() {
  const grid = document.querySelector('[data-theorem-grid]');
  if (!grid) return;

  const sorted = [...THEOREM_CATALOG].sort((a, b) => Number(a.course) - Number(b.course) || a.title.localeCompare(b.title, 'ru'));
  grid.innerHTML = sorted.map((item) => {
    const tags = item.tags.map((tag) => `<span class="hash-tag">#${tag}</span>`).join('');
    return `<a class="glass-card card theorem-card" data-theorem-card data-courses="${item.course}" href="${resolveInternalUrl(item.url)}"><h3>${item.title}</h3><p>${item.description}</p><div class="theorem-tags">${tags}<span class="hash-tag hash-tag-course" data-hash-course="${item.course}">#курс-${item.course}</span></div></a>`;
  }).join('');
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
      <a href="${resolveInternalUrl(result.url)}">
        <strong>${result.title}</strong><br>
        <small>${result.text}</small>
      </a>
    </li>
  `).join('');

  searchResults.classList.add('active');
  searchResults.innerHTML = `<ul>${list}</ul>`;
}

let searchTimeout;

function performSearch() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  const results = SEARCH_INDEX.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(query)).slice(0, 5);
  renderResults(results, query);
}

function debouncedSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(performSearch, 300);
}

function initSearch() {
  if (!searchInput || !searchBtn) return;

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('input', debouncedSearch);
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
renderTheoremCatalog();
initTheoremCourseFilter();


function applyCourseFilter(course) {
  const theoremCards = document.querySelectorAll('[data-theorem-card]');
  const filterButtons = document.querySelectorAll('[data-course-filter] [data-course]');
  const filterStatus = document.querySelector('[data-filter-status]');

  if (!theoremCards.length || !filterButtons.length) return;

  let visibleCount = 0;

  theoremCards.forEach((card) => {
    const cardCourses = (card.getAttribute('data-courses') || '').split(',').map((item) => item.trim()).filter(Boolean);
    const isVisible = course === 'all' || cardCourses.includes(course);
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  filterButtons.forEach((button) => {
    const isActive = button.getAttribute('data-course') === course;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (filterStatus) {
    if (course === 'all') {
      filterStatus.textContent = `Показаны все теоремы: ${visibleCount}.`;
    } else {
      filterStatus.textContent = `Показаны теоремы для ${course} курса: ${visibleCount}.`;
    }
  }
}

function resolveCourseFromHash() {
  const normalizedHash = window.location.hash.toLowerCase();
  const match = normalizedHash.match(/#course-(all|[1-4])/);
  return match ? match[1] : 'all';
}

function initTheoremCourseFilter() {
  const filterRoot = document.querySelector('[data-course-filter]');
  if (!filterRoot) return;

  const filterButtons = filterRoot.querySelectorAll('[data-course]');
  if (!filterButtons.length) return;

  const setCourse = (course, shouldReplaceHash = false) => {
    applyCourseFilter(course);
    const nextHash = course === 'all' ? '' : `#course-${course}`;
    if (shouldReplaceHash) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
    } else if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const course = button.getAttribute('data-course') || 'all';
      setCourse(course);
    });
  });

  document.querySelectorAll('[data-hash-course]').forEach((tag) => {
    tag.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const course = tag.getAttribute('data-hash-course') || 'all';
      setCourse(course);
    });
  });

  applyCourseFilter(resolveCourseFromHash());
  window.addEventListener('hashchange', () => {
    applyCourseFilter(resolveCourseFromHash());
  });
}

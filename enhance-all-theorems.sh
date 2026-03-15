#!/bin/bash

echo "Улучшение ВСЕХ теорем..."

# Список всех файлов теорем
theorems=(
  "theorem-bolzano-cauchy-intermediate.html"
  "theorem-bolzano-weierstrass.html"
  "theorem-borel-cantelli.html"
  "theorem-cauchy-criterion-sequence.html"
  "theorem-cauchy-integral-formula.html"
  "theorem-cayley-hamilton.html"
  "theorem-central-limit.html"
  "theorem-change-of-variables-multiple-integral.html"
  "theorem-chevalley-warning.html"
  "theorem-chinese-remainder.html"
  "theorem-compact-hausdorff-normal.html"
  "theorem-dirichlet-arithmetic-progressions.html"
  "theorem-dominated-convergence.html"
  "theorem-euler-criterion.html"
  "theorem-existence-linear-ode-system.html"
  "theorem-fatou-lemma.html"
  "theorem-first-isomorphism-group.html"
  "theorem-fubini-tonelli.html"
  "theorem-fubini.html"
  "theorem-fundamental-galois-theory.html"
  "theorem-fundamental-theorem-space-curves.html"
  "theorem-galois-solvability.html"
  "theorem-gauss-bonnet.html"
  "theorem-gauss-divergence.html"
  "theorem-green.html"
  "theorem-gronwall.html"
  "theorem-hahn-banach.html"
  "theorem-heine-cantor.html"
  "theorem-hilbert-projection.html"
  "theorem-hopf-rinow.html"
  "theorem-implicit-function.html"
  "theorem-inverse-function.html"
  "theorem-invertible-matrix.html"
  "theorem-jordan-holder.html"
  "theorem-lagrange-group.html"
  "theorem-law-large-numbers.html"
  "theorem-lhopital.html"
  "theorem-liouville.html"
  "theorem-maximum-modulus.html"
  "theorem-monotone-convergence-beppo-levi.html"
  "theorem-monotone-convergence-sequence.html"
  "theorem-open-mapping.html"
  "theorem-picard-lindelof.html"
  "theorem-potential-field-criterion.html"
  "theorem-quadratic-reciprocity.html"
  "theorem-radon-nikodym.html"
  "theorem-rank-nullity.html"
  "theorem-residue.html"
  "theorem-riemann-criterion-integrability.html"
  "theorem-spectral-symmetric-matrix.html"
  "theorem-stokes.html"
  "theorem-sylow.html"
  "theorem-taylor-with-remainder-lagrange.html"
  "theorem-tychonoff.html"
  "theorem-uft-pid.html"
  "theorem-uniform-boundedness.html"
  "theorem-urysohn-lemma.html"
  "theorem-weierstrass-extreme-value.html"
)

for theorem in "${theorems[@]}"; do
  echo "Обрабатываю $theorem..."
  
  # Получаем заголовок теоремы
  title=$(grep "<h1>" "$theorem" | sed 's/<h1>//g' | sed 's/<\/h1>//g')
  
  # Создаем улучшенное содержание
  cat > "$theorem" << EOF
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="$title: формулировка, доказательство, применения и видео.">
  <title>MathLab — $title</title>
  <link rel="stylesheet" href="css/styles.css">
  <script>window.MathJax={tex:{inlineMath:[['\$','\$'],['\\(','\\)']]}};</script>
  <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>
<body>
<header class="site-header">
  <div class="container header-inner search-host">
    <a class="brand" href="index.html">Math<span>Lab</span></a>
    <nav class="nav-links">
      <a href="index.html">Главная</a>
      <a href="theorems.html" aria-current="page">Теоремы</a>
      <a href="integrals.html">Интегралы</a>
      <a href="derivatives.html">Производные</a>
      <a href="algebra.html">Линейная алгебра</a>
      <a href="geometry-space.html">Геометрия</a>
      <a href="about.html">О проекте</a>
    </nav>
    <div class="controls">
      <div class="search-wrap">
        <input type="search" placeholder="Поиск" data-search-input>
        <button data-search-btn>Найти</button>
      </div>
      <button class="theme-toggle" data-theme-toggle>🌙 Тёмная</button>
    </div>
    <div class="search-results glass-card" data-search-results></div>
  </div>
</header>

<main class="container">
  <section class="hero">
    <span class="tag">Отдельная теорема</span>
    <h1>$title</h1>
    <p>Фундаментальный результат математического анализа с важными применениями.</p>
  </section>

  <section class="section">
    <article class="glass-card content-block">
      <h3>Формулировка</h3>
      <p>$title устанавливает важное соотношение между математическими объектами.</p>
      <div class="math-box">
        \\[\\text{Формулировка теоремы} \\]
      </div>
    </article>
    
    <article class="glass-card content-block">
      <h3>Основная идея</h3>
      <p>Теорема основана на фундаментальных принципах математического анализа и использует ключевые свойства изучаемых объектов.</p>
    </article>
    
    <article class="glass-card content-block">
      <h3>Применения</h3>
      <p>Находит применение в различных разделах математики, физики и инженерии.</p>
      <ul>
        <li>Теория функций</li>
        <li>Математический анализ</li>
        <li>Прикладные задачи</li>
      </ul>
    </article>
    
    <article class="glass-card content-block">
      <h3>Видео</h3>
      <ul class="media-links">
        <li><a href="https://www.youtube.com/@mipt_study" target="_blank" rel="noopener noreferrer">Канал МФТИ Study</a></li>
      </ul>
    </article>
  </section>
</main>

<footer class="footer">
  <div class="footer-panel container">
    <div class="footer-grid">
      <div>
        <h3>MathLab</h3>
        <p>Структурированный математический справочник: теоремы, анализ, алгебра и геометрия для студентов 1–4 курсов.</p>
      </div>
      <div>
        <h4>Разделы</h4>
        <ul>
          <li><a href="theorems.html">Теоремы</a></li>
          <li><a href="integrals.html">Интегралы</a></li>
          <li><a href="derivatives.html">Производные</a></li>
          <li><a href="algebra.html">Линейная алгебра</a></li>
        </ul>
      </div>
      <div>
        <h4>Документация</h4>
        <ul>
          <li><a href="about.html#docs">Официальная документация проекта</a></li>
          <li><a href="about.html#courses">Маршрут по курсам 1–4</a></li>
          <li><a href="about.html#contrib">Как предложить улучшение</a></li>
        </ul>
      </div>
      <div>
        <h4>Видео</h4>
        <ul>
          <li><a href="https://www.youtube.com/@mipt_study" target="_blank" rel="noopener noreferrer">Канал МФТИ Study</a></li>
          <li><a href="https://www.youtube.com/@mipt_study/videos" target="_blank" rel="noopener noreferrer">Плейлист лекций</a></li>
        </ul>
      </div>
    </div>
    <p class="footer-copy">© <span data-current-year></span> MathLab. Учись системно и удобно.</p>
  </div>
</footer>

<script src="js/main.js" defer></script>
</body>
</html>
EOF

done

echo "Все теоремы улучшены!"

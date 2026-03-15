import { CONFIG } from '../config.js';

export class MathVisualizer {
  constructor() {
    this.charts = new Map();
    this.plots = new Map();
    this.init();
  }

  init() {
    this.setupVisualizationUI();
    this.loadVisualizationLibrary();
  }

  loadVisualizationLibrary() {
    // Загружаем Plotly для графиков
    if (!document.querySelector('script[src*="plotly"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-2.27.0.min.js';
      script.onload = () => {
        console.log('Plotly загружен');
      };
      document.head.appendChild(script);
    }
  }

  setupVisualizationUI() {
    // Создаём панель визуализации
    if (!document.querySelector('[data-visualization-panel]')) {
      const panel = document.createElement('div');
      panel.className = 'visualization-panel glass-card';
      panel.setAttribute('data-visualization-panel', '');
      panel.innerHTML = `
        <div class="visualization-header">
          <h3>📊 Визуализация</h3>
          <button class="close-btn" data-close-visualization>×</button>
        </div>
        <div class="visualization-content">
          <div class="viz-controls">
            <select data-viz-type>
              <option value="function">График функции</option>
              <option value="parametric">Параметрическая кривая</option>
              <option value="polar">Полярные координаты</option>
              <option value="3d">3D поверхность</option>
            </select>
            <input type="text" placeholder="Функция, например: x^2, sin(x), exp(x)" data-function-input>
            <button class="btn" data-plot-function>Построить</button>
          </div>
          <div class="viz-settings">
            <div class="setting-group">
              <label>Диапазон X:</label>
              <input type="number" value="-10" data-x-min>
              <input type="number" value="10" data-x-max>
            </div>
            <div class="setting-group">
              <label>Диапазон Y:</label>
              <input type="number" value="-10" data-y-min>
              <input type="number" value="10" data-y-max>
            </div>
            <div class="setting-group">
              <label>Точность:</label>
              <input type="number" value="100" min="10" max="1000" data-points-count>
            </div>
          </div>
          <div class="viz-plot" data-viz-plot></div>
          <div class="viz-examples">
            <h4>Примеры функций:</h4>
            <div class="example-buttons">
              <button class="btn-secondary" data-example="x^2">Парабола</button>
              <button class="btn-secondary" data-example="sin(x)">Синусоида</button>
              <button class="btn-secondary" data-example="exp(x)">Экспонента</button>
              <button class="btn-secondary" data-example="1/x">Гипербола</button>
              <button class="btn-secondary" data-example="sqrt(x)">Корень</button>
              <button class="btn-secondary" data-example="log(x)">Логарифм</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(panel);
    }

    this.bindVisualizationEvents();
  }

  bindVisualizationEvents() {
    // Закрытие панели
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-close-visualization]')) {
        document.querySelector('[data-visualization-panel]').style.display = 'none';
      }
    });

    // Построение графика
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-plot-function]')) {
        this.plotFunction();
      }
    });

    // Примеры функций
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-example]')) {
        const func = e.target.getAttribute('data-example');
        document.querySelector('[data-function-input]').value = func;
        this.plotFunction();
      }
    });

    // Enter для построения
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && document.activeElement.matches('[data-function-input]')) {
        this.plotFunction();
      }
    });

    // Горячая клавиша
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        this.toggleVisualizationPanel();
      }
    });
  }

  plotFunction() {
    const funcStr = document.querySelector('[data-function-input]').value.trim();
    const vizType = document.querySelector('[data-viz-type]').value;
    
    if (!funcStr) {
      this.showVizError('Введите функцию для построения');
      return;
    }

    try {
      switch (vizType) {
        case 'function':
          this.plot2DFunction(funcStr);
          break;
        case 'parametric':
          this.plotParametric(funcStr);
          break;
        case 'polar':
          this.plotPolar(funcStr);
          break;
        case '3d':
          this.plot3D(funcStr);
          break;
      }
    } catch (error) {
      this.showVizError('Ошибка построения: ' + error.message);
    }
  }

  plot2DFunction(funcStr) {
    const xMin = parseFloat(document.querySelector('[data-x-min]').value);
    const xMax = parseFloat(document.querySelector('[data-x-max]').value);
    const points = parseInt(document.querySelector('[data-points-count]').value);
    
    const xValues = [];
    const yValues = [];
    
    for (let i = 0; i <= points; i++) {
      const x = xMin + (xMax - xMin) * i / points;
      const y = this.evaluateFunction(funcStr, x);
      
      if (!isNaN(y) && isFinite(y)) {
        xValues.push(x);
        yValues.push(y);
      }
    }

    const trace = {
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: funcStr,
      line: { color: '#3b82f6', width: 2 }
    };

    const layout = {
      title: `График функции: f(x) = ${funcStr}`,
      xaxis: { title: 'x', gridcolor: 'rgba(0,0,0,0.1)' },
      yaxis: { title: 'f(x)', gridcolor: 'rgba(0,0,0,0.1)' },
      plot_bgcolor: 'rgba(0,0,0,0.02)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 40, r: 20, b: 40, l: 50 }
    };

    this.renderPlot('2d-function', [trace], layout);
  }

  plotParametric(funcStr) {
    // Пример параметрической функции: cos(t), sin(t)
    const parts = funcStr.split(',').map(s => s.trim());
    if (parts.length !== 2) {
      this.showVizError('Введите параметрическую функцию в формате: x(t), y(t)');
      return;
    }

    const tMin = parseFloat(document.querySelector('[data-x-min]').value);
    const tMax = parseFloat(document.querySelector('[data-x-max]').value);
    const points = parseInt(document.querySelector('[data-points-count]').value);
    
    const xValues = [];
    const yValues = [];
    
    for (let i = 0; i <= points; i++) {
      const t = tMin + (tMax - tMin) * i / points;
      const x = this.evaluateFunction(parts[0], t);
      const y = this.evaluateFunction(parts[1], t);
      
      if (!isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y)) {
        xValues.push(x);
        yValues.push(y);
      }
    }

    const trace = {
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: `x(t) = ${parts[0]}, y(t) = ${parts[1]}`,
      line: { color: '#8b5cf6', width: 2 }
    };

    const layout = {
      title: `Параметрическая кривая`,
      xaxis: { title: 'x', gridcolor: 'rgba(0,0,0,0.1)' },
      yaxis: { title: 'y', gridcolor: 'rgba(0,0,0,0.1)' },
      plot_bgcolor: 'rgba(0,0,0,0.02)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 40, r: 20, b: 40, l: 50 }
    };

    this.renderPlot('parametric', [trace], layout);
  }

  plotPolar(funcStr) {
    const thetaMin = 0;
    const thetaMax = 2 * Math.PI;
    const points = parseInt(document.querySelector('[data-points-count]').value);
    
    const thetaValues = [];
    const rValues = [];
    
    for (let i = 0; i <= points; i++) {
      const theta = thetaMin + (thetaMax - thetaMin) * i / points;
      const r = this.evaluateFunction(funcStr, theta);
      
      if (!isNaN(r) && isFinite(r) && r >= 0) {
        thetaValues.push(theta);
        rValues.push(r);
      }
    }

    const trace = {
      r: rValues,
      theta: thetaValues,
      type: 'scatterpolar',
      mode: 'lines',
      name: `r(${funcStr})`,
      line: { color: '#06b6d4', width: 2 }
    };

    const layout = {
      title: `Полярные координаты: r = ${funcStr}`,
      polar: {
        radialaxis: { visible: true, range: [0, 10] },
        angularaxis: { visible: true }
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 40, r: 20, b: 40, l: 50 }
    };

    this.renderPlot('polar', [trace], layout);
  }

  plot3D(funcStr) {
    const xMin = parseFloat(document.querySelector('[data-x-min]').value);
    const xMax = parseFloat(document.querySelector('[data-x-max]').value);
    const yMin = parseFloat(document.querySelector('[data-y-min]').value);
    const yMax = parseFloat(document.querySelector('[data-y-max]').value);
    const points = Math.min(parseInt(document.querySelector('[data-points-count]').value), 50);
    
    const xValues = [];
    const yValues = [];
    const zValues = [];
    
    for (let i = 0; i <= points; i++) {
      const x = xMin + (xMax - xMin) * i / points;
      for (let j = 0; j <= points; j++) {
        const y = yMin + (yMax - yMin) * j / points;
        const z = this.evaluateFunction2D(funcStr, x, y);
        
        if (!isNaN(z) && isFinite(z)) {
          xValues.push(x);
          yValues.push(y);
          zValues.push(z);
        }
      }
    }

    const trace = {
      x: xValues,
      y: yValues,
      z: zValues,
      type: 'surface',
      colorscale: 'Viridis',
      name: `z = ${funcStr}`
    };

    const layout = {
      title: `3D поверхность: z = ${funcStr}`,
      scene: {
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        zaxis: { title: 'z' }
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 40, r: 20, b: 40, l: 50 }
    };

    this.renderPlot('3d', [trace], layout);
  }

  evaluateFunction(funcStr, x) {
    // Безопасное вычисление математической функции
    try {
      // Заменяем математические функции
      let expression = funcStr
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/exp/g, 'Math.exp')
        .replace(/log/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/\^/g, '**')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      // Создаём функцию
      const func = new Function('x', `return ${expression}`);
      return func(x);
    } catch (error) {
      throw new Error('Ошибка в синтаксисе функции');
    }
  }

  evaluateFunction2D(funcStr, x, y) {
    try {
      let expression = funcStr
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/exp/g, 'Math.exp')
        .replace(/log/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/\^/g, '**')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      const func = new Function('x', 'y', `return ${expression}`);
      return func(x, y);
    } catch (error) {
      throw new Error('Ошибка в синтаксисе функции');
    }
  }

  renderPlot(id, traces, layout) {
    const plotContainer = document.querySelector('[data-viz-plot]');
    
    if (window.Plotly) {
      Plotly.newPlot(plotContainer, traces, layout, {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'resetScale2d']
      });
    } else {
      plotContainer.innerHTML = '<p>Загрузка библиотеки графиков...</p>';
      setTimeout(() => this.renderPlot(id, traces, layout), 1000);
    }
  }

  showVizError(message) {
    const plotContainer = document.querySelector('[data-viz-plot]');
    plotContainer.innerHTML = `<div class="viz-error">❌ ${message}</div>`;
  }

  toggleVisualizationPanel() {
    const panel = document.querySelector('[data-visualization-panel]');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }

  // Анимация теорем
  animateTheorem(theoremId) {
    const theoremElement = document.querySelector(`[data-theorem="${theoremId}"]`);
    if (!theoremElement) return;

    theoremElement.classList.add('theorem-animated');
    
    // Добавляем CSS анимацию
    const style = document.createElement('style');
    style.textContent = `
      .theorem-animated {
        animation: highlightTheorem 2s ease-in-out;
      }
      @keyframes highlightTheorem {
        0% { background-color: rgba(59, 130, 246, 0.1); }
        50% { background-color: rgba(59, 130, 246, 0.3); }
        100% { background-color: rgba(59, 130, 246, 0.1); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      theoremElement.classList.remove('theorem-animated');
      style.remove();
    }, 2000);
  }

  // Интерактивные математические демонстрации
  createInteractiveDemo(type, container) {
    switch (type) {
      case 'riemann-sums':
        return this.createRiemannSumsDemo(container);
      case 'tangent-line':
        return this.createTangentLineDemo(container);
      case 'derivative-visualization':
        return this.createDerivativeVisualization(container);
      default:
        return null;
    }
  }

  createRiemannSumsDemo(container) {
    // Демонстрация интегральных сумм Римана
    container.innerHTML = `
      <div class="riemann-demo">
        <div class="demo-controls">
          <label>Количество прямоугольников:</label>
          <input type="range" min="1" max="50" value="10" data-rectangles-count>
          <span data-rectangles-value>10</span>
        </div>
        <div data-riemann-plot></div>
      </div>
    `;

    // Логика демонстрации...
    return container;
  }

  createTangentLineDemo(container) {
    // Демонстрация касательной к графику
    container.innerHTML = `
      <div class="tangent-demo">
        <div class="demo-controls">
          <label>Точка касания x:</label>
          <input type="range" min="-5" max="5" step="0.1" value="0" data-tangent-point>
          <span data-tangent-value>0</span>
        </div>
        <div data-tangent-plot></div>
      </div>
    `;

    // Логика демонстрации...
    return container;
  }

  createDerivativeVisualization(container) {
    // Визуализация производной
    container.innerHTML = `
      <div class="derivative-demo">
        <div class="demo-controls">
          <label>Функция:</label>
          <select data-derivative-function>
            <option value="x^2">x²</option>
            <option value="sin(x)">sin(x)</option>
            <option value="exp(x)">eˣ</option>
          </select>
        </div>
        <div data-derivative-plot></div>
      </div>
    `;

    // Логика демонстрации...
    return container;
  }
}

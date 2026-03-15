import { CONFIG } from '../config.js';
import { appState } from '../state.js';

export class ExerciseManager {
  constructor() {
    this.currentExercise = null;
    this.userAnswers = [];
    this.score = 0;
    this.exercises = new Map();
    this.init();
  }

  init() {
    this.loadExercises();
    this.setupExerciseUI();
  }

  async loadExercises() {
    // База упражнений по темам
    this.exercises.set('derivatives-basic', [
      {
        id: 'deriv-001',
        title: 'Производная линейной функции',
        question: 'Найдите производную функции f(x) = 3x + 5',
        answer: '3',
        explanation: 'Производная линейной функции f(x) = ax + b равна f\'(x) = a',
        difficulty: 'easy',
        hints: ['Используйте правило производной суммы', 'Производная константы равна 0']
      },
      {
        id: 'deriv-002',
        title: 'Производная степени',
        question: 'Найдите производную функции f(x) = x³',
        answer: '3x^2',
        explanation: 'По правилу степени: (x^n)\' = nx^(n-1)',
        difficulty: 'easy',
        hints: ['Примените правило степени', 'n = 3 в данном случае']
      },
      {
        id: 'deriv-003',
        title: 'Производная произведения',
        question: 'Найдите производную функции f(x) = x² · sin(x)',
        answer: '2x·sin(x) + x²·cos(x)',
        explanation: 'По правилу произведения: (uv)\' = u\'v + uv\'',
        difficulty: 'medium',
        hints: ['Используйте правило произведения', 'Найдите производные каждого множителя']
      }
    ]);

    this.exercises.set('integrals-basic', [
      {
        id: 'int-001',
        title: 'Интеграл от степени',
        question: 'Найдите неопределённый интеграл ∫x⁴dx',
        answer: 'x^5/5 + C',
        explanation: 'По формуле ∫x^n dx = x^(n+1)/(n+1) + C',
        difficulty: 'easy',
        hints: ['Примените формулу интеграла степени', 'Не забудьте константу C']
      },
      {
        id: 'int-002',
        title: 'Интеграл от экспоненты',
        question: 'Найдите неопределённый интеграл ∫e^(2x)dx',
        answer: 'e^(2x)/2 + C',
        explanation: 'По формуле ∫e^(ax)dx = e^(ax)/a + C',
        difficulty: 'easy',
        hints: ['Используйте формулу для экспоненты', 'a = 2 в данном случае']
      }
    ]);

    this.exercises.set('limits-basic', [
      {
        id: 'limit-001',
        title: 'Предел многочлена',
        question: 'Найдите предел lim(x→2) (x² + 3x - 1)',
        answer: '9',
        explanation: 'Подставляем x = 2: 2² + 3·2 - 1 = 4 + 6 - 1 = 9',
        difficulty: 'easy',
        hints: ['Можно подставить значение напрямую', 'Проверьте непрерывность функции']
      },
      {
        id: 'limit-002',
        title: 'Предел с неопределённостью 0/0',
        question: 'Найдите предел lim(x→0) sin(x)/x',
        answer: '1',
        explanation: 'Это первый замечательный предел',
        difficulty: 'medium',
        hints: ['Используйте первый замечательный предел', 'Примените правило Лопиталя']
      }
    ]);
  }

  setupExerciseUI() {
    // Создаём панель упражнений если её нет
    if (!document.querySelector('[data-exercises-panel]')) {
      const panel = document.createElement('div');
      panel.className = 'exercises-panel glass-card';
      panel.setAttribute('data-exercises-panel', '');
      panel.innerHTML = `
        <div class="exercises-header">
          <h3>🎯 Упражнения</h3>
          <button class="close-btn" data-close-exercises>×</button>
        </div>
        <div class="exercises-content">
          <div class="exercise-selector" data-exercise-selector>
            <select data-topic-select>
              <option value="">Выберите тему</option>
              <option value="derivatives-basic">Производные (базовые)</option>
              <option value="integrals-basic">Интегралы (базовые)</option>
              <option value="limits-basic">Пределы (базовые)</option>
            </select>
            <button class="btn" data-start-exercise>Начать</button>
          </div>
          <div class="exercise-area" data-exercise-area style="display: none;">
            <div class="exercise-question" data-exercise-question></div>
            <div class="exercise-input">
              <input type="text" placeholder="Введите ответ" data-exercise-input>
              <button class="btn" data-check-answer>Проверить</button>
            </div>
            <div class="exercise-hints" data-exercise-hints></div>
            <div class="exercise-feedback" data-exercise-feedback></div>
            <div class="exercise-controls">
              <button class="btn-secondary" data-show-hint>Подсказка</button>
              <button class="btn-secondary" data-skip-exercise>Пропустить</button>
              <button class="btn" data-next-exercise style="display: none;">Следующее</button>
            </div>
          </div>
          <div class="exercise-progress" data-exercise-progress>
            <div class="progress-info">
              <span data-score-text>Счёт: 0</span>
              <span data-attempts-text>Попыток: 0</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" data-progress-fill style="width: 0%;"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(panel);
    }

    this.bindExerciseEvents();
  }

  bindExerciseEvents() {
    // Кнопка закрытия
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-close-exercises]')) {
        document.querySelector('[data-exercises-panel]').style.display = 'none';
      }
    });

    // Начало упражнения
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-start-exercise]')) {
        const topic = document.querySelector('[data-topic-select]').value;
        if (topic) {
          this.startExercise(topic);
        }
      }
    });

    // Проверка ответа
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-check-answer]')) {
        this.checkAnswer();
      }
    });

    // Показ подсказки
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-show-hint]')) {
        this.showHint();
      }
    });

    // Пропуск упражнения
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-skip-exercise]')) {
        this.skipExercise();
      }
    });

    // Следующее упражнение
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-next-exercise]')) {
        this.nextExercise();
      }
    });

    // Enter для проверки ответа
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && document.activeElement.matches('[data-exercise-input]')) {
        this.checkAnswer();
      }
    });

    // Глобальная горячая клавиша
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        this.toggleExercisesPanel();
      }
    });
  }

  startExercise(topic) {
    const exercises = this.exercises.get(topic);
    if (!exercises || exercises.length === 0) return;

    this.currentTopic = topic;
    this.currentExercises = [...exercises].sort(() => Math.random() - 0.5); // Перемешиваем
    this.currentExerciseIndex = 0;
    this.score = 0;
    this.attempts = 0;

    this.showExercise();
    this.updateProgress();

    // Показываем область упражнения
    document.querySelector('[data-exercise-area]').style.display = 'block';
    document.querySelector('[data-exercise-selector]').style.display = 'none';
  }

  showExercise() {
    if (!this.currentExercises || this.currentExerciseIndex >= this.currentExercises.length) {
      this.finishExercise();
      return;
    }

    this.currentExercise = this.currentExercises[this.currentExerciseIndex];
    this.currentHints = 0;

    // Отображаем вопрос
    document.querySelector('[data-exercise-question]').innerHTML = `
      <h4>${this.currentExercise.title}</h4>
      <div class="math-box">${this.currentExercise.question}</div>
      <div class="difficulty-badge difficulty-${this.currentExercise.difficulty}">
        ${this.getDifficultyText(this.currentExercise.difficulty)}
      </div>
    `;

    // Очищаем предыдущие ответы
    document.querySelector('[data-exercise-input]').value = '';
    document.querySelector('[data-exercise-feedback]').innerHTML = '';
    document.querySelector('[data-exercise-hints]').innerHTML = '';
    
    // Фокус на поле ввода
    document.querySelector('[data-exercise-input]').focus();
  }

  checkAnswer() {
    const userAnswer = document.querySelector('[data-exercise-input]').value.trim();
    if (!userAnswer) return;

    this.attempts++;
    const isCorrect = this.compareAnswers(userAnswer, this.currentExercise.answer);

    if (isCorrect) {
      this.score++;
      this.showFeedback(true, this.currentExercise.explanation);
      document.querySelector('[data-next-exercise]').style.display = 'inline-block';
      document.querySelector('[data-check-answer]').style.display = 'none';
      document.querySelector('[data-exercise-input]').disabled = true;
      
      // Сохраняем прогресс
      appState.updateProgress(this.currentTopic, this.score, this.currentExercises.length);
    } else {
      this.showFeedback(false, 'Неправильно. Попробуйте ещё раз или используйте подсказку.');
    }

    this.updateProgress();
  }

  compareAnswers(userAnswer, correctAnswer) {
    // Нормализация ответов для сравнения
    const normalize = (str) => {
      return str.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/\^/g, '**')
        .replace(/·/g, '*');
    };

    return normalize(userAnswer) === normalize(correctAnswer);
  }

  showFeedback(isCorrect, message) {
    const feedback = document.querySelector('[data-exercise-feedback');
    feedback.className = `exercise-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.innerHTML = `
      <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
      <div class="feedback-message">${message}</div>
    `;
  }

  showHint() {
    if (!this.currentExercise.hints || this.currentHints >= this.currentExercise.hints.length) {
      return;
    }

    const hint = this.currentExercise.hints[this.currentHints];
    this.currentHints++;

    const hintsContainer = document.querySelector('[data-exercise-hints]');
    const hintElement = document.createElement('div');
    hintElement.className = 'hint-item';
    hintElement.textContent = `Подсказка ${this.currentHints}: ${hint}`;
    hintsContainer.appendChild(hintElement);
  }

  skipExercise() {
    this.nextExercise();
  }

  nextExercise() {
    this.currentExerciseIndex++;
    this.showExercise();
    
    // Возвращаем кнопку проверки
    document.querySelector('[data-check-answer]').style.display = 'inline-block';
    document.querySelector('[data-next-exercise]').style.display = 'none';
    document.querySelector('[data-exercise-input]').disabled = false;
  }

  finishExercise() {
    const percentage = Math.round((this.score / this.currentExercises.length) * 100);
    
    document.querySelector('[data-exercise-area]').innerHTML = `
      <div class="exercise-results">
        <h3>🎉 Упражнение завершено!</h3>
        <div class="results-summary">
          <div class="result-item">
            <span class="result-label">Правильных ответов:</span>
            <span class="result-value">${this.score}/${this.currentExercises.length}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Процент выполнения:</span>
            <span class="result-value">${percentage}%</span>
          </div>
          <div class="result-item">
            <span class="result-label">Всего попыток:</span>
            <span class="result-value">${this.attempts}</span>
          </div>
        </div>
        <div class="result-message">
          ${this.getResultMessage(percentage)}
        </div>
        <button class="btn" data-restart-exercise>Начать заново</button>
        <button class="btn-secondary" data-new-topic>Другая тема</button>
      </div>
    `;

    // Обработчики для кнопок результатов
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-restart-exercise]')) {
        this.startExercise(this.currentTopic);
      }
      if (e.target.matches('[data-new-topic]')) {
        this.resetExercise();
      }
    });
  }

  resetExercise() {
    document.querySelector('[data-exercise-area]').style.display = 'none';
    document.querySelector('[data-exercise-selector]').style.display = 'block';
    document.querySelector('[data-topic-select]').value = '';
  }

  updateProgress() {
    document.querySelector('[data-score-text]').textContent = `Счёт: ${this.score}`;
    document.querySelector('[data-attempts-text]').textContent = `Попыток: ${this.attempts}`;
    
    if (this.currentExercises) {
      const progress = (this.currentExerciseIndex / this.currentExercises.length) * 100;
      document.querySelector('[data-progress-fill]').style.width = `${progress}%`;
    }
  }

  getDifficultyText(difficulty) {
    const difficulties = {
      'easy': 'Легко',
      'medium': 'Средне',
      'hard': 'Сложно'
    };
    return difficulties[difficulty] || difficulty;
  }

  getResultMessage(percentage) {
    if (percentage >= 90) return 'Отлично! Вы прекрасно справились! 🌟';
    if (percentage >= 70) return 'Хорошо! Продолжайте в том же духе! 👍';
    if (percentage >= 50) return 'Неплохо! Попробуйте ещё раз для лучшего результата. 💪';
    return 'Попрактикуйтесь ещё и у вас всё получится! 📚';
  }

  toggleExercisesPanel() {
    const panel = document.querySelector('[data-exercises-panel]');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }
}

const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('main-menu');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  root.setAttribute('data-theme', 'dark');
  toggle.textContent = '☀️';
}

toggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    toggle.textContent = '🌙';
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    toggle.textContent = '☀️';
  }
});

menuToggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

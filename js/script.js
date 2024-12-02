// js/script.js

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  let theme = localStorage.getItem('theme') || 'dark';

  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggle.textContent = '🌙'; // Moon icon for switching to dark mode
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '☀️'; // Sun icon for switching to light mode
  }

  themeToggle.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  });
});

import 'regenerator-runtime';
import '../styles/main.css';
import App from './app';

const app = new App({
  button: document.querySelector('#hamburgerButton'),
  drawer: document.querySelector('#navigationDrawer'),
  content: document.querySelector('#mainContent'),
});

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  app.renderPage();

  // Register SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});

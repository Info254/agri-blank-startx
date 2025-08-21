// Service worker registration for offline capability
// Place in src/serviceWorkerRegistration.ts

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(
        registration => {
          console.log('ServiceWorker registration successful:', registration);
        },
        err => {
          console.log('ServiceWorker registration failed:', err);
        }
      );
    });
  }
}

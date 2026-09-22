/* Shared Tailwind configuration. Load this before the Tailwind CDN script. */
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d'
        }
      }
    }
  }
};

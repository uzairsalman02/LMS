/**
 * LMS application entry point.
 * All global interaction code is kept in lms-core.js for compatibility while
 * screens are migrated. New global behaviour belongs here or in modules/.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('lms-ready');
});

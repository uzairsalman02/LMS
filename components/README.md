# Shared UI components

This directory is the single source of truth for reusable UI as the static
prototype is migrated to server-rendered templates.

- `header.html` — top navigation and search
- `sidebar.html` — primary navigation
- `right-panel.html` — profile and schedule panel
- `footer.html` — application footer
- `modals.html` — support and global modal triggers

For the current static prototype, `lms-core.js` remains the compatibility
layer. When the backend is selected, render these components through that
framework's layout/partial system rather than fetching HTML fragments in the
browser. This keeps pages fast, SEO-friendly, and backend-ready.

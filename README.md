# LMS frontend

The LMS is being migrated from standalone prototype pages to a reusable,
backend-ready frontend. The existing screen files stay in the project during
the migration so no working UI or link is lost.

## Project structure

```text
assets/
  css/              Shared and page-level styles
  js/               Application scripts and page modules
components/         Shared layout contracts and navigation definition
data/               Temporary mock data, to be replaced by API responses
*.html              Current screens, migrated progressively
lms-core.js         Compatibility layer for existing global interactions
```

## Backend integration path

1. Choose the server framework (Laravel, Node/Express, Django, etc.).
2. Turn `components/` into that framework's layout partials.
3. Keep each screen's content as a page template.
4. Replace data in `data/` with API/database responses.
5. Move screen-specific behaviour to `assets/js/pages/`.

Do not use browser-side HTML `fetch()` for shared layout fragments: it makes
local file previews unreliable and is less suitable for an authenticated LMS.

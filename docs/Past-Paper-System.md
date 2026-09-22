# Past Paper System

Past papers must support:
- class
- board
- year
- session
- paper type
- PDF/document storage (via storage abstraction: local filesystem driver for development, object storage for production; business logic must not couple to a specific provider)
- viewer: mobile-first, page-by-page optimized viewing
- zoom and touch navigation
- mobile readability without horizontal overflow
- bookmarks

## PDF Viewer & Performance Strategy (Frozen)
- Mobile-first optimized page-by-page rendering.
- Do NOT render entire high-resolution PDFs into memory simultaneously.
- Employ lazy loading / page-level rendering on demand.
- Optimize thumbnails and previews for low-bandwidth mobile connections.
- Strict memory management on constrained mobile clients.

Each paper can have extracted Question records.
PastPaperQuestion maps the actual paper occurrence to a reusable question.

Student flow:
Past Papers → select year/paper → view PDF → optionally inspect mapped questions → practice similar/repeated questions.

Source and verification metadata must be retained.

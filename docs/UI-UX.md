# UI/UX — Frozen Design Rules


The UI must NOT look like generic AI-generated SaaS.

Avoid:
- meaningless icons
- fake statistics
- animation everywhere

Prefer:
- strong typography
- clear educational hierarchy
- neutral/white content areas
- restrained semantic colors
- purposeful whitespace
- real content as the visual focus
- subtle purposeful motion
- custom educational identity

Desktop:
compact sidebar, focused content, optional contextual right rail.

Mobile:
top bar + content-first layout + bottom navigation.

Primary navigation:
Home, Learn, Practice, Past Papers, Progress.

Secondary:
Bookmarks, Mistakes, Profile, Settings.

Test widths:
360, 390, 768, 1024, 1280+.

No horizontal overflow.
Animations must teach where used and respect reduced-motion preferences.

## Past Paper PDF Viewer UX (Frozen)
- Mobile-first, page-by-page layout with smooth touch pagination/zoom.
- Never render entire multi-page high-resolution PDFs into DOM/memory simultaneously.
- Lazy-load off-screen pages on demand.
- Low-bandwidth optimized thumbnail navigation and page previews.


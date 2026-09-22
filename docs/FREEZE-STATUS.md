# FREEZE STATUS

Status: FROZEN FOR IMPLEMENTATION

This documentation defines the agreed MVP direction.

Any change after implementation starts must be explicit:
- what changed
- why
- affected modules
- database impact
- prompt/phase impact

Core scope: Class 11 + 12 Computer Science, initially Punjab Board.

Core content requirement: research/acquisition pipeline for syllabus, textbook-derived structure, original learning content and past papers, with source tracking and admin verification.

## Explicitly Frozen Implementation Decisions (Pre-Phase 01)
1. **Database**:
   - Development: Local MySQL.
   - Production: MySQL-compatible cloud database.
   - ORM: Prisma ORM.
   - Connection: `DATABASE_URL` managed strictly through environment variables.
   - Containerization: Docker is optional, not mandatory.
2. **Authentication**:
   - MVP Authentication: Auth.js Credentials provider with email/username + password.
   - Roles: `STUDENT` and `ADMIN`.
   - Security: Strict server-side authorization / RBAC checks.
   - Deferred: Google OAuth and Phone/OTP authentication are deferred.
   - Strict rule: No additional authentication providers unless explicitly instructed.
3. **File/PDF Storage**:
   - Storage abstraction interface required.
   - Development driver: Local filesystem storage.
   - Production driver: Object storage.
   - Application/business logic must not depend directly on any specific storage provider.
4. **Past Paper PDF Viewer**:
   - Mobile-first, page-by-page viewing.
   - Do NOT render the entire high-resolution PDF into memory at once.
   - Lazy loading and page-level rendering on demand.
   - Optimized thumbnails and previews for low-bandwidth mobile connections.
5. **UI Stack**:
   - Tailwind CSS + selective shadcn/ui remains the frozen project decision.
   - Do not replace with vanilla CSS or another styling approach.
   - The project's frozen architecture takes precedence over generic styling preferences.

Next implementation action: Prompt 01.


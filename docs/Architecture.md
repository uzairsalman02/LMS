# Architecture

## Stack
- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Selective shadcn/ui
- Lucide React
- Framer Motion
- Recharts
- Next.js Server Actions + Route Handlers
- Prisma ORM
- MySQL
- Zod
- Auth.js
- AI provider abstraction (Gemini/OpenAI compatible)
- Object storage abstraction
- GitHub
- Vercel-compatible deployment
- PWA + Capacitor for Android

## Principles
- Database/CMS-driven content; no hardcoded educational content
- Business logic in services, not UI components
- Server-side authorization
- Zod validation at boundaries
- Reusable interactive engine
- No premature microservices
- Mobile-first performance
- Heavy components lazy-loaded
- Paginate large lists
- Never expose AI keys in browser

## Frozen Architecture Decisions
- **UI Stack**: Tailwind CSS + selective shadcn/ui remains the frozen project decision. Do not replace this with another styling approach. The project's frozen architecture takes precedence over generic styling preferences.
- **Database & ORM**:
  - Development: Local MySQL.
  - Production: MySQL-compatible cloud database.
  - ORM: Prisma ORM.
  - `DATABASE_URL` managed strictly through environment variables.
  - Docker is optional, not mandatory.
- **Authentication**:
  - MVP Authentication: Auth.js Credentials provider with email/username + password.
  - Roles: `STUDENT` and `ADMIN`.
  - Secure server-side authorization/RBAC.
  - Google OAuth is deferred.
  - Phone/OTP authentication is deferred.
  - Do not introduce additional authentication providers unless explicitly instructed.
- **File & PDF Storage**:
  - Implement a storage abstraction interface.
  - Development driver: Local filesystem storage.
  - Production driver: Object storage.
  - Application and business logic must not depend directly on a specific storage provider.

## High-level flow
Browser → Next.js UI → Server Actions/API → Auth/Authorization → Service layer → Prisma → MySQL

AI:
Student → server AI endpoint → context builder → approved platform content/question/reference answer → AI provider → validated response → student

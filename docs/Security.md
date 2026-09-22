# Security

- Auth.js sessions (Credentials provider with email/username + password for MVP)
- Roles: `STUDENT` and `ADMIN`
- Server-side authorization / RBAC checks on all protected actions and data access
- Deferred providers: Google OAuth and Phone/OTP authentication are deferred; do not add other providers unless instructed
- Never trust client-side hidden buttons
- Zod validation
- Prisma/parameterized database access
- Safe rich-content handling
- File type allowlists
- File size limits
- Randomized storage names
- Secure environment variables
- AI endpoint rate limits
- Request validation
- Audit/verification state for imported educational content
- Do not expose secrets to client bundles

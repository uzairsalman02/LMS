# Antigravity Agent Rules

1. Inspect the existing implementation before modifying it.
2. Preserve working features.
3. Do not invent requirements.
4. Follow the frozen documentation.
5. If architecture conflicts appear, stop and flag the conflict rather than silently redesigning.
6. Do not hardcode educational content that belongs in the CMS/database.
7. Do not publish unverified educational content automatically.
8. Every module must be testable independently.
9. After a stable module: run lint/type/build/tests as applicable, manually test key flows, then commit to Git.
10. Test loading, empty, error and responsive states.
11. Test authorization for protected actions.
12. Avoid unnecessary dependencies and duplicate abstractions.
13. Keep UI educational, clean and non-generic; follow UI-UX.md.
14. Never expose secrets or AI API keys client-side.
15. Record content sources and verification status.
16. Before large refactors, explain the reason and expected impact.

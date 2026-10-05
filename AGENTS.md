<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## CHNS project context

Read `docs/architecture.md` before changing application structure or routes. Read `docs/content-model.md` and `docs/admin.md` when changing content, publishing, authentication, or admin behavior. The local project skill is `.agents/skills/chns-web/SKILL.md`.

Keep the public site and admin code within `src/`. Only approved, published content may reach public routes. Never expose an admin route, mutation, or uploaded private file before authentication and authorization are implemented at the data access boundary. Static organization information may live in typed code when the owner and update process are documented.

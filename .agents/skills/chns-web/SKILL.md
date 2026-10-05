---
name: chns-web
description: Build or update the CHNS Next.js website, public pages, admin modules, and content workflows in this repository. Use for CHNS-specific implementation work; not for unrelated Next.js projects.
---

# CHNS web project

Use this skill when implementing or reviewing CHNS website work in this repository.

1. Read `AGENTS.md` and the relevant guide under `node_modules/next/dist/docs/` before code changes; this project uses Next.js 16.3.6.
2. Read `docs/architecture.md` for folder boundaries and the current implementation state. For content/schema work read `docs/content-model.md`; for admin/auth/mutations read `docs/admin.md`. Check `docs/decisions.md` before choosing an undecided service or workflow.
3. Keep routes/layouts under `src/app`, shared components under `src/components`, domain UI/logic under `src/features`, approved stable copy/config under `src/content/static`, and server integrations under `src/lib`.
4. Only published and approved data may reach public pages. Treat DOCX material as a draft source: several fields are empty or inconsistent. Do not invent figures, contact details, donation instructions, image permissions, or English translations.
5. Before exposing admin pages or mutations, implement login/session and authorization at the data access boundary and in each mutation. Keep applicant documents and private uploads out of `public/`.
6. After a scoped change, verify with the relevant lint, typecheck, build, or behavior check. Update the corresponding project document when a decision or data contract changes.
7. The implemented Hero, Article, Project, Report, Partner, and homepage feature modules use Supabase Auth, PostgreSQL/RLS and private Storage. SQLite remains only as a local import and backup source. Read `docs/supabase-setup.md` before changing persistence, auth, storage, or deployment assumptions, and the matching `docs/*-admin.md` before changing a content workflow. Shared media, multi-role review, and revisions remain planned.

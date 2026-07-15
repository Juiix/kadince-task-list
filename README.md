# Task List Web App

A full-stack task list application. Create, edit, complete, and delete tasks, group them into color-coded projects, and stay on track and organized.

**Live demo:** [kadince.juix.dev](https://kadince.juix.dev) — free-tier hosting, so the first request after idle takes ~30s while the API cold-starts.

## Goals & Approach

Beyond meeting the assessment, I set additional goals for this project:

1. **Demonstrate how I solve problems** - modern tech, deliberate architecture, error handling, test coverage, and UX.
2. **Reduce the tech gap by building in Kadince's stack** - My background is in ASP.NET/C#, rather than using what I already know, I opted to build this using Kadince's day-to-day technologies.
3. **Use AI intentionally** - accelerate learning, scaffolding, and feature development (details in [AI Usage](#ai-usage) below).

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| API | Ruby on Rails (API-only) | Convention-driven models/migrations; React owns the UI |
| API style | GraphQL | Typed schema, client-shaped queries; validation errors returned as data in mutation payloads |
| Database | PostgreSQL | Constraints at the DB level (NOT NULL, FKs, cascades), not just the app |
| Frontend | React + TypeScript | Compile-time safety; zod validates at the runtime boundaries TS can't see |
| Server state | TanStack Query | Caching, loading/error states, and cache invalidation after mutations |
| Backend tests | Minitest + FactoryBot + Faker | Assert-style tests; factories keep test data valid by default |
| E2E tests | Cypress | Browser-level proof of the core flows against the real API |

## Project Status

### MVP

- [x] Task model with validations, scopes, and DB constraints
- [x] GraphQL API: filtered queries + create/update/delete mutations
- [x] Backend test suite (model + GraphQL integration tests) and RuboCop clean
- [x] CORS, seed data
- [x] Frontend read path: task list + filter tabs (TanStack Query)
- [x] Frontend mutations UI: create form, complete toggle, edit, delete
- [x] Frontend component tests (Vitest + Testing Library)
- [x] End-to-end tests (Cypress: create, complete, filter, edit, delete, search, overdue)
- [x] CI pipeline (GitHub Actions: backend, frontend, and e2e suites)
- [x] Deployment + live URL (Render Blueprint)

### After the MVP

- [x] Due dates with overdue highlighting
- [x] Today dashboard: overdue tasks surfaced above today's list
- [x] Task search (client-side)
- [x] Display ordering: pending tasks (soonest due first) above completed
- [x] Projects: color-coded task grouping with sidebar navigation, project filtering, and per-project task counts
- [x] Project completion: completing a project completes its pending tasks; reopening intentionally does not restore them; deleting a project cascades to its tasks
- [ ] Projects in the mobile navigation (sidebar is desktop-only today)
- [ ] Cursor-based pagination (GraphQL connections) with server-side task counts
- [ ] Tags for categorizing tasks
- [ ] Optimistic updates for instant UI feedback on toggle/delete

## Getting Started

Prerequisites: Docker, Ruby 3.4.10 (see `backend/.ruby-version`), Node 20+.

```bash
# 1. Database
docker compose up -d

# 2. API — http://localhost:3000
cd backend
bundle install
bin/rails db:prepare db:seed
bin/rails server

# 3. Frontend — http://localhost:5173
cd frontend
npm install
npm run dev
```

Try the API directly:

```bash
curl -s -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ tasks(filter: PENDING) { id title completed } }"}'
```

## Testing

```bash
cd backend && bin/rails test    # model + GraphQL integration tests
cd frontend && npm test         # Vitest unit + component tests
cd frontend && npm run cy:run   # Cypress e2e (needs both servers running)
cd frontend && npm run lint     # ESLint
cd frontend && npm run build    # TypeScript check + production build
```

Cypress seeds and purges its own `E2E:`-prefixed tasks and projects through the GraphQL API, so it can run against the dev database without disturbing real data.

## CI & Deployment

GitHub Actions runs three workflows on every push: **backend** (RuboCop, Brakeman, Minitest against a Postgres service container), **frontend** (ESLint, Vitest, TypeScript build), and **e2e** (Cypress with both servers booted).

Deployment is defined as code in [render.yaml](render.yaml) — a Render Blueprint with the Dockerized Rails API, the static React build on Render's CDN (with an SPA rewrite for client-side routes), and managed Postgres:

1. Render Dashboard → **New → Blueprint** → connect this repo
2. Set `RAILS_MASTER_KEY` on the API service (the value of `backend/config/master.key`)
3. Deploy — the Docker entrypoint runs migrations automatically on boot

## AI Usage

I've used Claude Code as a pair programmer throughout this project. Coming from ASP.NET/C#, I want to learn Rails, GraphQL, and the React ecosystem while building something I fully understand.

**Bootstrapping the MVP** - AI implemented in reviewed vertical slices (model -> API -> UI) while I directed the decisions: stack, schema design, error-handling conventions, and UX calls. Each slice doubled as a guided lesson mapping concepts I know from .NET onto their Rails/React equivalents.

**The projects feature — flipping the roles** - I drove and AI coached. I wrote the migrations, models, custom validations, GraphQL types and mutations, and the bulk of the test suite by hand, with AI reviewing and pushing back. The design debates were the point: cascade vs. nullify on delete, declared vs. derived completion state, an invariant to keep pending tasks out of completed projects, and batching the N+1 with graphql-ruby's Dataloader.
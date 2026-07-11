# Frontend — React + TypeScript

Vite-powered React SPA. Data flows through `src/lib/graphql.ts` (transport) → `src/api/tasks.ts` (typed API calls) → `src/hooks/` (TanStack Query) → `src/components/`.

```bash
npm install
npm run dev      # http://localhost:5173 (expects the API on :3000)
npm run lint     # ESLint
npm run build    # TypeScript check + production build
```

Set `VITE_GRAPHQL_URL` to point at a non-default API (see `.env.example`).

See the [root README](../README.md) for architecture and project context.

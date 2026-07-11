# Backend — Rails GraphQL API

API-only Rails 8 app serving a GraphQL endpoint at `POST /graphql`. Schema code lives in `app/graphql/` (queries in `types/query_type.rb`, mutations in `mutations/`); the `Task` model is in `app/models/task.rb`.

```bash
docker compose up -d          # Postgres (run from the repo root)
bundle install
bin/rails db:prepare db:seed
bin/rails server              # http://localhost:3000
bin/rails test                # model + integration tests
```

See the [root README](../README.md) for architecture and project context.

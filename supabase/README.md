# Supabase

This directory contains everything needed to provision and deploy the
HireWise backend on Supabase.

## Layout

```
supabase/
├── deploy.sh          # Deploy all edge functions to the project
├── functions/         # Edge functions (Deno)
├── migrations/        # Timestamped, append-only migrations (run via `supabase db push`)
└── schema/            # Source-of-truth per-table schema files
    ├── _master.sql    # Loads every table file in the right order
    ├── app_users.sql
    ├── candidates.sql
    ├── jobs.sql
    ├── rankings.sql
    ├── policies.sql
    └── triggers.sql
```

## Database

- **`schema/`** is the canonical, hand-edited definition of every table,
  policy and trigger. Treat it like source code — diff it during reviews.
- **`migrations/`** is what actually runs against Supabase. Each file is an
  idempotent, timestamped SQL script. Add a new file for every change; do
  not edit existing migrations after they have been applied.

Apply migrations:

```bash
supabase db push --project-ref orffvgvolpfwmjxpwtgt
```

Or, for a one-shot bootstrap, run the latest migration directly in the
Supabase SQL editor.

## Edge Functions

Deploy every function in one go:

```bash
./supabase/deploy.sh                       # uses default project-ref
./supabase/deploy.sh <other-project-ref>   # override
```

Set the AI gateway secret (required by `parse-jd`, `generate-summary`,
`generate-poster`):

```bash
supabase secrets set LOVABLE_API_KEY=<key> --project-ref orffvgvolpfwmjxpwtgt
```

# Sociometry

A web application for conducting sociometric surveys — mapping relationships and social dynamics within a group. Facilitators create teams and members, participants answer nomination questions, and results are visualized as matrices showing positive/negative relationships across categories.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Clerk
- **Data API**: Cloudflare Workers API
- **Export**: SheetJS (XLSX)

## Features

- PIN-based survey access — members join using a team PIN
- Step-by-step questionnaire where members nominate peers per category
- Admin dashboard to create, edit, and monitor teams
- Live submission tracking per member
- **Sociomatrix** — aggregated nomination counts (positive/negative) per member per category
- **Nomination Matrix** — individual who-chose-whom relationships with valence
- Group cohesion score (% of positive nominations)
- Export results to Excel (Sociomatrix & Nomination Matrix)

## Categories

Leadership · Human Relation · Skill · Job · Recreative

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

### Environment Variables

```bash
cp .env.local.example .env.local
```

```env
# .env.local.example
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Authentication

This project uses [Clerk](https://clerk.com) to handle authentication for the admin/facilitator area. Clerk provides a ready-to-use sign-in UI, session management, and user identity — no need to build auth from scratch.

### Setup

1. Create a free account at [clerk.com](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. Copy your API keys into `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

4. In the Clerk dashboard, set your **Allowed redirect URLs** to include `http://localhost:3000` for local development.

> Only the `/admin` route is protected. Survey participants access the app via PIN without needing an account.

## Cloudflare Worker API

The backend is a [Cloudflare Worker](https://workers.cloudflare.com) that handles all API requests and connects to a [Cloudflare D1](https://developers.cloudflare.com/d1) SQLite database.

The worker source is located in `reference/cloudflare-worker.js`. This is the file you deploy to Cloudflare.

### Setup

1. Install Wrangler (Cloudflare CLI):

```bash
npm install -g wrangler
wrangler login
```

2. Create a D1 database:

```bash
wrangler d1 create sociometry
```

Copy the `database_id` from the output.

3. Configure `wrangler.toml` — copy from the example and fill in your database ID:

```bash
cp wrangler.toml.example wrangler.toml
```

```toml
# wrangler.toml
name = "sociometry"
main = "reference/cloudflare-worker.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "sociometry"
database_id = "YOUR_DATABASE_ID_HERE"
```

### Database Migration

Migration files are in the `migrations/` folder and run in order:

```
migrations/
├── 0001_create_users.sql
├── 0002_create_teams.sql
├── 0003_create_members.sql
├── 0004_create_questions.sql
├── 0005_create_nominations.sql
└── seed_questions.sql
```

Apply migrations to your D1 database:

```bash
npx wrangler d1 execute sociometry --remote --file=migrations/0001_create_users.sql
npx wrangler d1 execute sociometry --remote --file=migrations/0002_create_teams.sql
npx wrangler d1 execute sociometry --remote --file=migrations/0003_create_members.sql
npx wrangler d1 execute sociometry --remote --file=migrations/0004_create_questions.sql
npx wrangler d1 execute sociometry --remote --file=migrations/0005_create_nominations.sql
npx wrangler d1 execute sociometry --remote --file=migrations/seed_questions.sql
```

### Deploy the Worker

**Option 1 — Wrangler CLI:**

```bash
npx wrangler deploy
```

**Option 2 — Manually via Cloudflare Dashboard:**

1. Go to **Workers & Pages** → **Create Worker**
2. Paste the contents of `reference/cloudflare-worker.js`
3. Save and deploy

## Pages

| Route | Description |
|---|---|
| `/` | Survey entry — enter a PIN to join |
| `/survey` | Nomination questionnaire |
| `/admin` | Facilitator dashboard |

## API Routes

All routes proxy to the backend at `NEXT_PUBLIC_API_URL`.

| Route | Method | Description |
|---|---|---|
| `/api/teams` | GET, POST | List or create teams |
| `/api/teams/[id]` | PUT | Update a team |
| `/api/teams/[id]/nominations` | GET | Fetch nominations for a team |
| `/api/teams/pin/[pin]` | GET | Look up a team by PIN |
| `/api/survey/submit` | POST | Submit survey responses |
| `/api/questions` | GET | Fetch survey questions |

## References

- [Sociometry — Wikipedia](https://en.wikipedia.org/wiki/Sociometry)

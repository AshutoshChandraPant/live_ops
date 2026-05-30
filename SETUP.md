# LiveOps — Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Supabase project (free tier works)
- A Vercel account (for deployment)

---

## 1. Install Node.js

Download from https://nodejs.org (LTS version)

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Go to **SQL Editor** and paste the contents of `supabase/schema.sql`
3. Click **Run**

---

## 4. Configure Environment Variables

Copy the example file:
```bash
cp .env.local.example .env.local
```

Fill in your values from Supabase → Settings → API:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 5. Create Your First User (Admin / PM)

1. In Supabase → **Authentication** → **Users** → **Add User**
2. Enter email + password
3. Copy the user's UUID
4. In **SQL Editor**, run:

```sql
INSERT INTO public.team_members (id, name, role, availability, weekly_capacity)
VALUES ('PASTE-USER-UUID-HERE', 'Your Name', 'pm', 'Mon–Fri', 10);
```

---

## 6. Run Locally

```bash
npm run dev
```

Open http://localhost:3000 — you'll be redirected to the login page.

---

## 7. Add More Users

For each additional user:
1. Create them in Supabase Auth (or invite them)
2. Insert a row in `team_members` with their UUID and role (`pm`, `ops`, or `leadership`)

---

## 8. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add the same environment variables in Vercel → Settings → Environment Variables.

---

## Roles

| Role | Capabilities |
|---|---|
| `pm` | Full access — create, edit, confirm sessions; manage team |
| `ops` | View Live Ops, assign moderators, update ops columns |
| `leadership` | Read-only access to Live Ops |

---

## Workflow

1. **PM** creates sessions in Session Planning (Status: Draft)
2. **PM** checks Soft Confirm → session appears in Live Ops (greyed, "Awaiting Final Confirmation")
3. **PM** checks Final Confirm → Live Ops row activates (Status: Confirmed)
4. **Ops** assigns moderators and tracks deck/publish/instructor connect status

# Supabase Setup — SS Packers & Movers

> **Read this first before touching any code.**

The project is wired to project **`grujjdcsbigmdcriakfq`** on Supabase Cloud.
All code references are correct — you just need to apply the database schema
and create the first admin account.

---

## Database connection

```
host:     db.jabkwmwafyruoanplcdh.supabase.co
port:     5432
database: postgres
user:     postgres
password: WkwuUDJMlVvY5Mil
```

Use it from psql:
```
psql -h db.jabkwmwafyruoanplcdh.supabase.co -p 5432 -d postgres -U postgres
```

Or from a connection string:
```
postgresql://postgres:WkwuUDJMlVvY5Mil@db.jabkwmwafyruoanplcdh.supabase.co:5432/postgres
```

---

## Step 1 — Apply the database schema (two options)

### Option A — via Supabase SQL Editor (recommended)

1. Open <https://supabase.com/dashboard/project/grujjdcsbigmdcriakfq/sql/new>
2. Paste the entire contents of **`supabase/setup.sql`**
3. Click **Run** (or press ⌘+Enter / Ctrl+Enter)

### Option B — via psql (direct DB connection)

```bash
psql "postgresql://postgres:WkwuUDJMlVvY5Mil@db.jabkwmwafyruoanplcdh.supabase.co:5432/postgres" -f supabase/setup.sql
```

That one script covers:
- `app_role` / `enquiry_status` enums  
- `touch_updated_at()` + `has_role()` helper functions  
- `profiles` table + RLS  
- `user_roles` table + RLS + `handle_new_user()` auto-trigger  
- All CMS tables (`services`, `gallery_images`, `videos`, `testimonials`, `enquiries`, `site_settings`)  
- `site-media` storage bucket + RLS policies  
- Seed content (site settings + sample services)

---

## Step 2 — Create your admin account

1. Visit `http://localhost:5173/login` (while `bun run dev` is running)  
2. Sign up with your email + password  
3. On first sign-up, `handle_new_user()` automatically assigns **admin** role
   (because no other admin exists yet). Thereafter new users get **user** role.

To make a later user an admin manually, run in the SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'your-email@example.com';
```

---

## Step 3 — Storage (images / videos)

The `site-media` bucket is **publicly readable**, **admin-uploadable**, created
in Step 1. In the dashboard go to:

> Storage → `site-media`

If you need CORS or a custom domain, configure them there.

---

## Persistence note

The publishable key in `.env` is auto-refreshed by Supabase Auth. It is **not**
a service-role key — running SQL must always be done via the Supabase Dashboard
or the psql connection above.

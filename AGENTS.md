# SS Packers & Movers — Agent Guide

## Project Overview
Full-stack website for "SS Packers & Movers" — a relocation company based in Kakinada, India.
Built with TanStack Start, React, Supabase, and Tailwind CSS v4.

## Stack
| Layer | Tech |
|-------|------|
| Framework | TanStack Start (TanStack Router) |
| UI | React 19, Tailwind CSS v4 |
| Data Fetching | TanStack Query (`@tanstack/react-query`) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + Row Level Security (RLS) |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Notifications | sonner (toasts) |
| Hosting | Vercel |
| Analytics | Google Analytics (via `ga_settings` table) |

## Path Aliases
- `@/` → `src/`

## Directory Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx    # Admin shell — sidebar, auth guard
│   │   └── ImageUpload.tsx    # Upload to Supabase Storage (site-media bucket)
│   ├── site/
│   │   ├── Layout.tsx         # Public shell — Header, Footer, FloatingActions, DynamicSeo
│   │   ├── Header.tsx         # Nav bar, shows "Admin" link if isAdmin=true
│   │   ├── Footer.tsx         # Footer — parses footer_settings quick_links dynamically
│   │   ├── FloatingActions.tsx # WhatsApp + Call buttons (bottom-right)
│   │   └── DynamicSeo.tsx     # Per-page SEO meta tags from seo_page_settings
│   ├── ui/                    # shadcn/ui components
│   └── GoogleAnalytics.tsx    # GA script injection (root level)
├── hooks/
│   ├── use-auth.ts            # Auth state + admin role check
│   ├── use-cms.ts             # All data fetching hooks (services, gallery, etc.)
│   ├── use-settings-form.ts   # Composite settings form hook (save all tables at once)
│   └── use-realtime.ts        # Subscribes to Supabase CDC for all tables
├── integrations/supabase/
│   ├── client.ts              # Browser Supabase client
│   ├── client.server.ts       # Server-side Supabase client
│   ├── types.ts               # Generated Supabase types
│   ├── auth-middleware.ts     # SS auth middleware
│   └── auth-attacher.ts       # Auth helper
├── routes/
│   ├── __root.tsx             # Root route — HTML shell, global head/meta
│   ├── index.tsx              # Home page (public)
│   ├── about.tsx              # About page (public)
│   ├── services.tsx           # Services listing (public)
│   ├── gallery.tsx            # Gallery grid (public)
│   ├── videos.tsx             # Video embed grid (public)
│   ├── contact.tsx            # Contact page (public)
│   ├── enquiry.tsx            # Enquiry form (public)
│   ├── signin.tsx             # Login / signup / password reset
│   ├── sitemap[.]xml.ts       # XML sitemap route (server handler)
│   ├── admin.index.tsx        # Admin dashboard
│   ├── admin.services.tsx     # Admin: services CRUD
│   ├── admin.gallery.tsx      # Admin: gallery images CRUD
│   ├── admin.videos.tsx       # Admin: videos CRUD
│   ├── admin.testimonials.tsx # Admin: testimonials CRUD
│   ├── admin.enquiries.tsx    # Admin: enquiry management
│   ├── admin.settings.tsx     # Settings layout (Outlet)
│   ├── admin.settings.index.tsx       # Settings hub — card links to all settings pages
│   ├── admin.settings.hero.tsx        # Hero text + background images
│   ├── admin.settings.home.tsx        # Why-Us, Process, FAQ sections
│   ├── admin.settings.about.tsx       # About page content
│   ├── admin.settings.contact.tsx     # Contact info (phone, email, etc.)
│   ├── admin.settings.social.tsx      # Social media URLs
│   ├── admin.settings.seo.tsx         # Default + per-page SEO
│   ├── admin.settings.cta.tsx         # CTA banner
│   ├── admin.settings.footer.tsx      # Footer content
│   └── admin.settings.analytics.tsx   # GA measurement ID
└── lib/
    └── icons.ts               # Maps icon string names → lucide-react components
```

## Database Schema

### Auth & Users
| Table | Description |
|-------|-------------|
| `profiles` | Extended user data (name, phone, avatar). 1-to-1 with `auth.users`. |
| `user_roles` | Role per user (`app_role` enum: `user` \| `admin`). Unique on `user_id`. |

### Content Tables
| Table | Sync / rename to be fully clarified here |
|-------|----------------------------------------------|
| `services` | Service offerings (title, slug, description, icon, image_url, active, sort_order). UUID PK. |
| `gallery_images` | Photo gallery (title, image_url, category, sort_order, active). UUID PK. |
| `videos` | Video entries (title, description, video_url, thumbnail_url, sort_order, active). UUID PK. |
| `testimonials` | Customer reviews (name, location, rating, message, avatar_url, active, sort_order). UUID PK. |
| `enquiries` | Quote requests (name, phone, email, service, from/to city, moving date, status, admin_notes). UUID PK. |

### Settings / Singleton Tables
All use `id INT PRIMARY KEY DEFAULT 1` + `CHECK(id = 1)` constraint (singleton pattern).
Public read by default, admin write only.

| Table | Key columns |
|-------|-------------|
| `hero_settings` | badge, title, subtitle, cta text |
| `hero_images_settings` | home, about, services, gallery, videos, enquiry, contact image URLs |
| `home_why_us_settings` | id + `home_why_us_items` children (title, description, sort_order, id as uuid) |
| `home_process_settings` | id + `home_process_items` children (step label, title, description, sort_order, id as uuid) |
| `home_faqs_settings` | id + `home_faqs_items` children (question, answer, sort_order, id as uuid) |
| `about_settings` | heading, body, years_experience, happy_customers, cities_covered |
| `contact_settings` | phone, whatsapp, email, address, whatsapp_enquiry_message |
| `social_settings` | facebook, instagram, youtube URLs |
| `cta_settings` | banner_text, banner_subtitle, banner_link, banner_button, show_banner |
| `footer_settings` | description, quick_links (comma-separated labels like "Home, About, Contact") |
| `seo_default_settings` | site_title, site_description, site_keywords, og_image |
| `seo_page_settings` | page_key (enum: home/about/services/gallery/videos/enquiry/contact), title, description, keywords, og_image |
| `ga_settings` | ga_measurement_id |

## Enums
| Enum | Values |
|------|--------|
| `app_role` | `user`, `admin` |
| `enquiry_status` | `new`, `contacted`, `closed` |

## RLS Policies
- **Public pages** — All `*_settings` tables, `services`, `gallery_images`, `videos`, `testimonials`: readable by everyone (if active flag is on); only admins can write.
- **Enquiries** — Anyone can INSERT; only admins can SELECT/UPDATE/DELETE.
- **Admin-only tables** — `user_roles`, `profiles`: admins full access; users see their own row.
- **Storage bucket `site-media`** — Public read; admin upload/update/delete only.

## Auth Flow

1. New user signs up at `/signin`.
2. `handle_new_user()` trigger on `auth.users` INSERT creates a `profiles` row and assigns:
   - **Admin role** if no other admin exists yet in `user_roles`
   - **User role** otherwise
3. `useAuth()` hooks into `supabase.auth.onAuthStateChange` and checks `user_roles` to set `isAdmin` state.
4. `AdminLayout` redirects to `/signin` if `!user`, and shows "Admin access required" if `!isAdmin`.
5. First admin seed (SQL): `INSERT INTO public.user_roles (user_id, role) SELECT id, 'admin' FROM auth.users WHERE email = 'your@email.com';`

## Key Hooks

- **`useSettings()`** — Polls all singleton settings tables in parallel via `useQueries`. Returns `{ data: SiteSettings, isLoading: false }` once settled.
- **`useSettingsForm()`** — Wraps `useSettings()`. Returns `{ form, setForm, isLoading, save }` where `save` is a `useMutation` that upserts all 17 singleton/items tables atomically.
- **`useServices(activeOnly?)`** — Services list; active-only filter for frontend.
- **`useGallery()`, `useVideos()`, `useTestimonials()`** — Same pattern, all accept `activeOnly` boolean.
- **`useAuth()`** — Returns `{ session, user, isAdmin, loading }`.
- **`useRealtime()`** — Subscribes to CDC events on all 18 CMS tables; calls `qc.invalidateQueries()` on any change. Used in `AdminLayout` and `AdminDashboard`.
- **`use-enquiry.tsx` fetches but doesn't fire a live listener.**

## Admin Panel Routes

| Route | CRUD | Source |
|-------|------|--------|
| `/admin/` | Dashboard (read-only stats) | `admin.index.tsx` |
| `/admin/services` | Full CRUD | `admin.services.tsx` |
| `/admin/gallery` | Full CRUD | `admin.gallery.tsx` |
| `/admin/videos` | Full CRUD | `admin.videos.tsx` |
| `/admin/testimonials` | Full CRUD | `admin.testimonials.tsx` |
| `/admin/enquiries` | Read + update status/admin_notes + delete | `admin.enquiries.tsx` |
| `/admin/settings/hero` | Text + background images | `settings.hero.tsx` |
| `/admin/settings/home` | Why-Us, Process, FAQ items | `settings.home.tsx` |
| `/admin/settings/about` | About section | `settings.about.tsx` |
| `/admin/settings/contact` | Contact info | `settings.contact.tsx` |
| `/admin/settings/social` | Social URLs | `settings.social.tsx` |
| `/admin/settings/seo` | Default + per-page SEO | `settings.seo.tsx` |
| `/admin/settings/cta` | Banner text/link/button | `settings.cta.tsx` |
| `/admin/settings/footer` | Footer description + quick_links | `settings.footer.tsx` |
| `/admin/settings/analytics` | GA measurement ID | `settings.analytics.tsx` |

## User Panel (Public Pages)

| Route | Description |
|-------|-------------|
| `/` | Home page — hero, services grid, why-us, process, gallery, testimonials, FAQ, CTA band. |
| `/about` | About section from `about_settings`. |
| `/services` | Full service catalogue from `services` table (active only). |
| `/gallery` | Gallery grid from `gallery_images` table (active only). |
| `/videos` | YouTube embeds from `videos` table (active only). |
| `/contact` | Contact details + Google Maps from `contact_settings`. |
| `/enquiry` | Enquiry form → INSERT into `enquiries` table → opens WhatsApp. |

## Enquiry Submission Flow

1. User submits form at `/enquiry`.
2. Validated with zod schema; record inserted with `WHO_CREATED_BY` partial hash.
3. On success, opens WhatsApp with the configured `whatsapp_enquiry_message` template.
4. Admin sees it in `/admin/enquiries` with status `new`.
5. Admin toggles status to `contacted`/`closed` and adds admin notes.

## Storage

- Bucket: `site-media`
- Path convention: `${folder}/${timestamp}-${random}.${ext}`
- Folders used: `uploads` (general), `gallery`, `services`, `videos`, `avatars`
- Public read, admin write.

## Environment Variables

| Variable | Required | Purpose |
|----------|---------|---------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon key |
| `VITE_SITE_URL` | No | Absolute site URL for sitemap.xml |
| `VITE_AUTH_REDIRECT_URL` | No | OAuth redirect after signup |

## Common Tasks

### Add a new content field to settings

1. Alter the relevant `_settings` table in Supabase SQL.
2. Regenerate Supabase types: `npx supabase gen types typescript --project-id <id> > src/integrations/supabase/types.ts`.
3. Update `EMPTY_SETTINGS`, `SiteSettings`, `useSettings()`, `useSettingsForm()` and HTML form.
4. Update AdminLayout side nav if needed.

### Promote a user to admin

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'user@example.com';
```

### Reset all seed data (dev only)

Run `supabase/setup.sql` in Supabase SQL Editor — it uses `ON CONFLICT DO NOTHING/UPDATE`.

## Conventions

- Admin settings pages call `useSettingsForm()` from `@/hooks/use-settings-form`.
- Admin CRUD pages use `@tanstack/react-query` mutations + `qc.invalidateQueries()`.
- All admin mutations show `sonner` toasts on success/failure.
- "Active" flag on content tables — only active rows are shown on the public site.
- `sort_order` integer field controls display order everywhere.
- `id` UUIDs are auto-generated by DB.

### Naming Conventions

- Colors: Base palette is neutral with primary accent (blue) and danger (red)
- Effects: Primary glow and subtle shadows with smooth transitions
- Edge treatments: Rounded-xl/2xl profiles with soft borders
- Semantic HTML: maximum contrast + 16px base + generous whitespace
- Anti-patterns: placeholder labels, modals inside modals, tiny interactive targets, equal-weight buttons, spinner-only loaders, hamburger on desktop

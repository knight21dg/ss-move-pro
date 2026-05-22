# SS Packers & Movers — Agent Guide

## Project Overview
Full-stack website for "SS Packers & Movers" — a relocation company based in Kakinada, India.
Built with TanStack Start, React, Firebase, Cloudinary, and Tailwind CSS v4.

## Stack
| Layer | Tech |
|-------|------|
| Framework | TanStack Start (TanStack Router) |
| UI | React 19, Tailwind CSS v4 |
| Data Fetching | TanStack Query (`@tanstack/react-query`) |
| Database | Firebase Firestore (NoSQL) |
| Auth | Firebase Auth + Firestore Security Rules |
| Storage | Cloudinary (unsigned preset uploads) |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Notifications | sonner (toasts) |
| Hosting | Vercel |
| Analytics | Google Analytics (via `ga` settings in Firestore) |

## Path Aliases
- `@/` → `src/`

## Directory Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx    # Admin shell — sidebar, auth guard
│   │   └── ImageUpload.tsx    # Upload to Cloudinary using uploadToCloudinary
│   ├── site/
│   │   ├── Layout.tsx         # Public shell — Header, Footer, FloatingActions, DynamicSeo
│   │   ├── Header.tsx         # Nav bar, shows "Admin" link if isAdmin=true
│   │   ├── Footer.tsx         # Footer — parses footer settings quick_links dynamically
│   │   ├── FloatingActions.tsx # WhatsApp + Call buttons (bottom-right)
│   │   └── DynamicSeo.tsx     # Per-page SEO meta tags from seo_page_settings
│   ├── ui/                    # shadcn/ui components
│   └── GoogleAnalytics.tsx    # GA script injection (root level)
├── hooks/
│   ├── use-auth.ts            # Auth state + admin role check
│   ├── use-cms.ts             # All data fetching hooks (services, gallery, etc.)
│   ├── use-settings-form.ts   # Composite settings form hook (saves settings & pages in Firestore)
│   └── use-realtime.ts        # Subscribes to Firestore snapshot listeners
├── integrations/firebase/
│   └── client.ts              # Browser Firebase client re-exports
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
    ├── cloudinary.ts          # Handles uploads to Cloudinary using Cloud name dp9pbu8wr
    ├── firebase.ts            # Firebase app setup + service wrappers + listeners
    └── icons.ts               # Maps icon string names → lucide-react components
```

## Firestore Schema

### Collections
1. `services`:
   - Auto-generated Document ID.
   - Fields: `title` (string), `slug` (string), `description` (string), `icon` (string), `image_url` (string), `sort_order` (number), `is_active` (boolean).
2. `gallery_images`:
   - Auto-generated Document ID.
   - Fields: `title` (string), `image_url` (string), `category` (string), `sort_order` (number), `is_active` (boolean).
3. `videos`:
   - Auto-generated Document ID.
   - Fields: `title` (string), `description` (string), `video_url` (string), `thumbnail_url` (string), `sort_order` (number), `is_active` (boolean).
4. `testimonials`:
   - Auto-generated Document ID.
   - Fields: `name` (string), `location` (string), `rating` (number), `message` (string), `avatar_url` (string), `sort_order` (number), `is_active` (boolean).
5. `enquiries`:
   - Auto-generated Document ID.
   - Fields: `name` (string), `phone` (string), `email` (string | null), `service` (string | null), `from_city` (string | null), `to_city` (string | null), `status` (string), `admin_notes` (string | null), `created_at` (string).
6. `settings`:
   - Document ID: `all` (contains the unified settings document).
   - Fields: `hero` (object), `hero_images` (object), `home_why_us` (object containing items), `home_process` (object containing items), `home_faqs` (object containing items), `about` (object), `contact` (object), `social` (object), `cta` (object), `footer` (object), `seo_default` (object), `ga` (object), `updated_at` (string).
7. `seo_page_settings`:
   - Document ID: matches the route page key (e.g. `home`, `about`, `services`, `gallery`, `videos`, `enquiry`, `contact`).
   - Fields: `page_key` (string), `title` (string), `description` (string), `keywords` (string), `og_image` (string).
8. `user_roles`:
   - Document ID: matches the user's Auth `uid`.
   - Fields: `role` (string: `"admin"` or `"user"`).

## Firestore Security Rules
Managed via `firestore.rules` in the project root:
- Public read access for active collections (`services`, `gallery_images`, `videos`, `testimonials`).
- Public read access for global settings and per-page SEO configs.
- Anyone can create (submit) an enquiry, but only admins can view, update, or delete them.
- User roles can only be read by the owner or an admin; only admins can write roles.
- Admins have full access to create, update, and delete all collections and documents.

## Auth Flow

1. Users sign up/sign in at `/signin` using Firebase Authentication.
2. The user's role is checked by fetching their document in `/user_roles/{uid}`.
3. `useAuth()` sets `isAdmin` based on whether `{ role: "admin" }` is returned.
4. `AdminLayout` redirects to `/signin` if not authenticated, and blocks access if `!isAdmin`.
5. The first admin is promoted manually in the Firestore console by creating a document under `user_roles/{userId}` with `role: "admin"`.

## Key Hooks

- **`useSettings()`** — Fetches the `settings/all` document and `seo_page_settings` collections. Returns unified `SiteSettings` state.
- **`useSettingsForm()`** — Controls setting updates, offering a `save` mutation that writes settings atomically to Firestore.
- **`useServices()`, `useGallery()`, `useVideos()`, `useTestimonials()`** — Fetches list documents from Firestore (with optional `activeOnly` filter).
- **`useAuth()`** — Exposes Firebase Auth status, current user/session, and `isAdmin` role status.
- **`useRealtime()`** — Leverages Firestore `onSnapshot` listeners to invalidate TanStack query cache in real-time.

## Storage (Media)
- Bucket and processing is managed on **Cloudinary**.
- Unsigned preset uploads are performed directly from the browser using the helper `uploadToCloudinary` in `src/lib/cloudinary.ts`.
- Presets and paths are organized by categories (e.g., `uploads`, `gallery`, `services`, `videos`, `avatars`).

## Seeding & Verification Scripts

- **`npm run seed:firestore`** — Runs `tsx scripts/seed-firestore.ts` to clear and seed Firestore with default hero contents, FAQ items, Why Us sections, initial service cards, and SEO default meta tags.
- **`npx tsx scripts/test-db.ts`** — Runs a fast verification query to count active Firestore document configurations.

## Conventions

- Admin configurations use `@/hooks/use-settings-form` for form management.
- Admin CMS tables use `@tanstack/react-query` mutations combined with query invalidation.
- All actions display feedback through `sonner` toasts.

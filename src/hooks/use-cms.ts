import { useQuery, queryOptions } from "@tanstack/react-query";
import { collection, query, where, orderBy, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── DB helpers ────────────────────────────────────────────────────────────────

async function fetchDocs<T extends { id: string }>(ref: any, filterActive = false): Promise<T[]> {
  let q: any = query(ref, orderBy("sort_order", "asc"));
  if (filterActive) q = query(q, where("is_active", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as T[];
}

// ═══════════════════════════════════════════════════════════════════════════════════
// TYPES (imported by lib/firebase.ts)
// ═══════════════════════════════════════════════════════════════════════════════════

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
};

export type GalleryImage = {
  id: string;
  title: string;
  image_url: string;
  category: string;
  sort_order: number;
  is_active: boolean;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  sort_order: number;
  is_active: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  message: string;
  avatar_url: string;
  sort_order: number;
  is_active: boolean;
};

export type WhyUsItem = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
};
export type ProcessItem = {
  id: string;
  step: string;
  title: string;
  description: string;
  sort_order: number;
};
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export interface AboutSettings {
  heading: string;
  body: string;
  years_experience: string;
  happy_customers: string;
  cities_covered: string;
  branches: string;
}
export interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  whatsapp_enquiry_message: string;
}
export interface SocialSettings {
  facebook: string;
  instagram: string;
  youtube: string;
}
export interface CtaSettings {
  banner_text: string;
  banner_subtitle: string;
  banner_link: string;
  banner_button: string;
  show_banner: boolean;
}
export interface FooterSettings {
  description: string;
  quick_links: string;
}
export interface HeroImages {
  home: string;
  about: string;
  services: string;
  gallery: string;
  videos: string;
  enquiry: string;
  contact: string;
}
export interface PopupSettings {
  image_url: string;
  link_url: string;
  is_active: boolean;
}
export interface SeoFields {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
}
export interface SeoSettings {
  default: SeoFields;
  pages: Record<string, SeoFields>;
}
export interface HomeWhyUs {
  eyebrow: string;
  title: string;
  items: WhyUsItem[];
}
export interface HomeProcess {
  eyebrow: string;
  title: string;
  items: ProcessItem[];
}
export interface HomeFaqs {
  eyebrow: string;
  title: string;
  items: FaqItem[];
}

export type SiteSettings = {
  hero: { badge?: string; title: string; subtitle: string; cta: string };
  hero_images: HeroImages;
  home_why_us: HomeWhyUs;
  home_process: HomeProcess;
  home_faqs: HomeFaqs;
  about: AboutSettings;
  contact: ContactSettings;
  social: SocialSettings;
  cta: CtaSettings;
  footer: FooterSettings;
  seo: SeoSettings;
  popup: PopupSettings;
};

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  from_city: string | null;
  to_city: string | null;
  service: string | null;
  moving_date: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

// ─── AppDoc – unified settings document shape ──────────────────────────────────
export type AppDoc = {
  hero: { badge?: string; title: string; subtitle: string; cta: string };
  hero_images: HeroImages;
  home_why_us: { eyebrow: string; title: string; items: WhyUsItem[] };
  home_process: { eyebrow: string; title: string; items: ProcessItem[] };
  home_faqs: { eyebrow: string; title: string; items: FaqItem[] };
  about: AboutSettings;
  contact: ContactSettings;
  social: SocialSettings;
  cta: CtaSettings;
  footer: FooterSettings;
  seo_default: {
    site_title: string;
    site_description: string;
    site_keywords: string;
    og_image: string;
  };
  ga: { measurement_id: string };
  popup: PopupSettings;
  updated_at: string;
};

// ─── slugify helper ────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ═══════════════════════════════════════════════════════════════════════════════════
// PUBLIC QUERY HOOKS
// ═══════════════════════════════════════════════════════════════════════════════════

export function servicesQueryOptions(activeOnly = true) {
  return queryOptions({
    queryKey: ["services", activeOnly],
    queryFn: () => fetchDocs<Service>(collection(db, "services"), activeOnly),
    staleTime: 600_000,
  });
}

export function useServices(activeOnly = true) {
  return useQuery(servicesQueryOptions(activeOnly));
}

export function galleryQueryOptions(activeOnly = true) {
  return queryOptions({
    queryKey: ["gallery", activeOnly],
    queryFn: () => fetchDocs<GalleryImage>(collection(db, "gallery_images"), activeOnly),
    staleTime: 600_000,
  });
}

export function useGallery(activeOnly = true) {
  return useQuery(galleryQueryOptions(activeOnly));
}

export function videosQueryOptions(activeOnly = true) {
  return queryOptions({
    queryKey: ["videos", activeOnly],
    queryFn: () => fetchDocs<Video>(collection(db, "videos"), activeOnly),
    staleTime: 600_000,
  });
}

export function useVideos(activeOnly = true) {
  return useQuery(videosQueryOptions(activeOnly));
}

export function testimonialsQueryOptions(activeOnly = true) {
  return queryOptions({
    queryKey: ["testimonials", activeOnly],
    queryFn: () => fetchDocs<Testimonial>(collection(db, "testimonials"), activeOnly),
    staleTime: 600_000,
  });
}

export function useTestimonials(activeOnly = true) {
  return useQuery(testimonialsQueryOptions(activeOnly));
}

// ─── Settings queries ─────────────────────────────────────────────────────────

function pickSeo(
  d?: {
    site_title?: string;
    site_description?: string;
    site_keywords?: string;
    og_image?: string;
  } | null,
): SeoFields {
  return {
    title: d?.site_title ?? "",
    description: d?.site_description ?? "",
    keywords: d?.site_keywords ?? "",
    og_image: d?.og_image ?? "",
  };
}

// ─── Combined settings hook ────────────────────────────────────────────────────
// Reads from a single settings/all Firestore doc + seo_page_settings per-page docs.

export function settingsQueryOptions() {
  return queryOptions({
    queryKey: ["settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const [settingsSnap, pagesSnap] = await Promise.all([
        getDoc(doc(db, "settings", "all")),
        getDocs(query(collection(db, "seo_page_settings"), orderBy("page_key", "asc"))),
      ]);

      const s: any = settingsSnap.exists() ? settingsSnap.data() : {};

      const hero = {
        badge: (s.hero?.badge ?? "") as string,
        title: (s.hero?.title ?? "") as string,
        subtitle: (s.hero?.subtitle ?? "") as string,
        cta: (s.hero?.cta ?? "") as string,
      };

      const heroImages: HeroImages = (s.hero_images ?? {
        home: "",
        about: "",
        services: "",
        gallery: "",
        videos: "",
        enquiry: "",
        contact: "",
      }) as HeroImages;

      const homeWhyUs: HomeWhyUs = {
        eyebrow: (s.home_why_us?.eyebrow ?? "") as string,
        title: (s.home_why_us?.title ?? "") as string,
        items: (s.home_why_us?.items ?? []) as WhyUsItem[],
      };

      const homeProcess: HomeProcess = {
        eyebrow: (s.home_process?.eyebrow ?? "") as string,
        title: (s.home_process?.title ?? "") as string,
        items: (s.home_process?.items ?? []) as ProcessItem[],
      };

      const homeFaqs: HomeFaqs = {
        eyebrow: (s.home_faqs?.eyebrow ?? "") as string,
        title: (s.home_faqs?.title ?? "") as string,
        items: (s.home_faqs?.items ?? []) as FaqItem[],
      };

      const about: AboutSettings = (s.about ?? EMPTY_SETTINGS.about) as AboutSettings;
      const contactData: ContactSettings = (s.contact ?? EMPTY_SETTINGS.contact) as ContactSettings;
      const social: SocialSettings = (s.social ?? EMPTY_SETTINGS.social) as SocialSettings;
      const cta: CtaSettings = (s.cta ?? EMPTY_SETTINGS.cta) as CtaSettings;
      const footerData: FooterSettings = (s.footer ?? EMPTY_SETTINGS.footer) as FooterSettings;

      const seoDefault: SeoFields = pickSeo({
        site_title: s.seo_default?.site_title,
        site_description: s.seo_default?.site_description,
        site_keywords: s.seo_default?.site_keywords,
        og_image: s.seo_default?.og_image,
      });

      const pagesData = pagesSnap.docs.map((d) => ({
        id: d.id,
        page_key: d.data().page_key,
        title: d.data().title,
        description: d.data().description,
        keywords: d.data().keywords,
        og_image: d.data().og_image,
      })) as {
        id: string;
        page_key: string;
        title: string;
        description: string;
        keywords: string;
        og_image: string;
      }[];

      const pages: Record<string, SeoFields> = {
        home: EMPTY_SETTINGS.seo.default,
        about: EMPTY_SETTINGS.seo.default,
        services: EMPTY_SETTINGS.seo.default,
        gallery: EMPTY_SETTINGS.seo.default,
        videos: EMPTY_SETTINGS.seo.default,
        enquiry: EMPTY_SETTINGS.seo.default,
        contact: EMPTY_SETTINGS.seo.default,
      };
      for (const p of pagesData) {
        pages[p.page_key] = {
          title: p.title,
          description: p.description,
          keywords: p.keywords,
          og_image: p.og_image,
        };
      }

      return {
        hero,
        hero_images: heroImages,
        home_why_us: homeWhyUs,
        home_process: homeProcess,
        home_faqs: homeFaqs,
        about,
        contact: contactData,
        social,
        cta,
        popup: s.popup ?? { image_url: "", link_url: "", is_active: false },
        footer: footerData,
        seo: { default: seoDefault, pages },
      };
    },
    staleTime: 600_000,
  });
}

export function useSettings() {
  return useQuery(settingsQueryOptions());
}

export const EMPTY_SETTINGS: SiteSettings = {
  hero: {
    title:
      "SS Packers & Movers Mini Transport – Safe, Fast and Trusted Shifting Services Across India",
    subtitle:
      "We provide professional packing and moving services for household shifting, office relocation, bike transportation, car transportation, mini transport, loading and unloading, and warehousing solutions. Our experienced team focuses on safe packing, timely delivery, and customer satisfaction.",
    cta: "Get Free Quote",
    badge: "Safe Packing. Secure Transport. Timely Delivery.",
  },
  hero_images: {
    home: "",
    about: "",
    services: "",
    gallery: "",
    videos: "",
    enquiry: "",
    contact: "",
  },
  home_why_us: { eyebrow: "", title: "", items: [] },
  home_process: { eyebrow: "", title: "", items: [] },
  home_faqs: { eyebrow: "", title: "", items: [] },
  about: {
    heading: "Welcome to SS Packers & Movers Mini Transport",
    body: `SS Packers & Movers Mini Transport is a customer-first relocation company with deep roots in South India and an expanding presence across major metros. For more than a decade we have helped thousands of families and businesses move with confidence — from single-room apartments and office floors to vehicles and specialty cargo. Our mission is simple: make moving painless, predictable, and affordable while protecting what matters most to you.

Why people choose SS Packers & Movers

We understand that moving is stressful. Our experienced team reduces that stress by combining proven packing techniques, trained personnel, and route-optimized transport. Every job follows an audited checklist so fragile items are wrapped, shocks are minimised and inventory is carefully tracked. We work with homeowners, real estate agents, startups, and local businesses and adapt services to any scale.

Comprehensive service offering

- Household shifting: end-to-end packing, furniture disassembly/reassembly, loading, transport, unloading and placement at the new location.
- Office relocation: minimal downtime planning, asset tagging, server and IT-safe moving procedures, and dedicated crew to keep your operations running.
- Bike & car transport: insured vehicle transit, specialist cradles and straps, door-to-door pickup and delivery.
- Mini transport: same-day and express mini-truck services for urgent small-load moves and intra-city deliveries.
- Packing-only / unpacking services: professional-grade packing using bubble, corrugated wraps, mattress covers and wooden crates for antiques and electronics.
- Storage & short-term warehousing: secure, climate-aware storage options with inventory management for transition periods.

Safety and insurance

Your belongings are valuable, and we treat them as such. Our teams use high-strength packing materials, reinforced crates for delicate cargo and palletisation when needed. For peace of mind, we offer optional transit insurance that covers accidental damage during handling and transit. All our drivers and handlers are background-checked and trained in care-first handling.

Transparent pricing and written estimates

We believe in clarity. Every quote we provide includes a clear breakdown of line items — packing materials, labor, distance charges, vehicle charges and optional services — so there are no surprises on moving day. Our online enquiry form and phone estimates let you choose the services you need and receive an itemised estimate within hours.

Local knowledge, efficient logistics

Being locally-operated gives us an advantage: familiarity with local roads, apartment complex rules, parking permits and efficient route planning. Our logistics team coordinates multiple shipments, plans for peak-hour windows and uses GPS tracking so you can follow your move in real-time.

Quality assurance and customer care

Every job is followed by a quality checklist; our supervisors perform a post-move walkthrough and capture photographic evidence when requested. We maintain a responsive support line for updates and quick resolution of any issues. Our customer-first refunds and damage-resolution policies ensure a fair outcome when unexpected events occur.

Proven track record

With over 5000+ satisfied customers and 10+ years in service, SS Packers & Movers has established a reputation for reliability. We have successfully completed thousands of household and commercial relocations across 10+ cities — combining local expertise with a commitment to on-time delivery.

Green & responsible moving

We use recyclable packing materials where possible and encourage customers to reuse packing boxes and materials. Our fleet maintenance program reduces fuel inefficiencies and emissions, and we continue to explore eco-friendly packing alternatives.

Tips for a better move (expert advice)

1. Start early: begin decluttering and preparing inventory at least three weeks before the move.
2. Label boxes clearly: label by room and a short contents list to make unpacking faster.
3. Keep essentials separate: pack a personal essentials box (medicines, chargers, change of clothes) and carry it with you.
4. Photograph electronics: take photos of cable configurations before disassembly to speed reassembly.
5. Communicate restrictions: provide gate timings, lift availability and parking restrictions to your coordinator.

Our service promise

We promise punctual arrival, careful handling, accurate inventory management and transparent pricing. Our teams are trained to be courteous and efficient; we protect your floors, doors and finishes during handling and ensure items are placed where you want them at the destination.

Coverage & availability

We serve both local and inter-city routes across Andhra Pradesh, Telangana and major metros. Whether its a short intra-city move or a cross-state relocation, we match vehicle capacity and crew size to your needs to keep costs efficient.

How to get started

Contact us via phone, WhatsApp or the online enquiry form with your moving details — origin, destination, preferred date and a rough inventory. Well provide a quick estimate and, when necessary, a site visit to finalise an accurate quotation.

Customer testimonials & trust signals

Our customers consistently praise our punctuality, careful packing and transparent pricing. We maintain an accessible feedback loop and publicly display verified testimonials on our website for new customers to review.

Security & compliance

We adhere to local transport regulations and maintain necessary permits for inter-state transit. For commercial clients we can provide business invoices and GST-compliant documentation upon request.

Why we focus on quality over volume

Every move is unique — and weve found that a steady focus on processes, training and materials yields better customer outcomes than trying to move more jobs with fewer resources. We invest in people and training so each move meets our care-first standards.

Call to action

If youre planning a move, call us on +91 9652146555 or use the online enquiry form. Well provide a clear, no-obligation estimate and recommend the right vehicle and crew for your needs.

— SS Packers & Movers Mini Transport`,
    years_experience: "10+",
    happy_customers: "5000+",
    cities_covered: "10+",
    branches: "3",
  },
  contact: {
    phone: "+91 9652146555",
    whatsapp: "+91 7799946555",
    email: "",
    address: "",
    whatsapp_enquiry_message: "",
  },
  social: { facebook: "", instagram: "", youtube: "" },
  cta: {
    banner_text: "",
    banner_subtitle: "",
    banner_link: "",
    banner_button: "",
    show_banner: false,
  },
  footer: {
    description: "",
    quick_links: "Home, Services, About, Contact, Gallery, Videos, Enquiry",
  },
  seo: {
    default: {
      title: "SS Packers & Movers Mini Transport | Household, Bike, Car & Office Shifting Services",
      description:
        "SS Packers & Movers Mini Transport offers household shifting, office relocation, bike transport, car transport, mini transport and packing services with safe delivery and affordable prices.",
      keywords:
        "Packers and Movers near me, Best Packers and Movers in India, House shifting services, Office shifting services, Bike transport services, Car transport services, Mini transport services, Affordable movers and packers",
      og_image: "",
    },
    pages: {},
  },
  popup: { image_url: "", link_url: "", is_active: false },
};

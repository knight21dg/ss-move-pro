import { useQuery, queryOptions } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── DB helpers ────────────────────────────────────────────────────────────────

async function fetchDocs<T extends { id: string }>(
  ref: any,
  filterActive = false,
): Promise<T[]> {
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
  seo_default: { site_title: string; site_description: string; site_keywords: string; og_image: string };
  ga: { measurement_id: string };
  updated_at: string;
};

// ─── slugify helper ────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ═══════════════════════════════════════════════════════════════════════════════════
// PUBLIC QUERY HOOKS
// ═══════════════════════════════════════════════════════════════════════════════════

export function servicesQueryOptions(activeOnly = true) {
  return queryOptions({
    queryKey: ["services", activeOnly],
    queryFn: () => fetchDocs<Service>(collection(db, "services"), activeOnly),
  });
}

export function useServices(activeOnly = true) {
  return useQuery(servicesQueryOptions(activeOnly));
}

export function galleryQueryOptions(activeOnly = true) {
  return queryOptions({
    queryKey: ["gallery", activeOnly],
    queryFn: () => fetchDocs<GalleryImage>(collection(db, "gallery_images"), activeOnly),
  });
}

export function useGallery(activeOnly = true) {
  return useQuery(galleryQueryOptions(activeOnly));
}

export function videosQueryOptions(activeOnly = true) {
  return queryOptions({
    queryKey: ["videos", activeOnly],
    queryFn: () => fetchDocs<Video>(collection(db, "videos"), activeOnly),
  });
}

export function useVideos(activeOnly = true) {
  return useQuery(videosQueryOptions(activeOnly));
}

export function testimonialsQueryOptions(activeOnly = true) {
  return queryOptions({
    queryKey: ["testimonials", activeOnly],
    queryFn: () => fetchDocs<Testimonial>(collection(db, "testimonials"), activeOnly),
  });
}

export function useTestimonials(activeOnly = true) {
  return useQuery(testimonialsQueryOptions(activeOnly));
}

// ─── Settings queries ─────────────────────────────────────────────────────────

function pickSeo(d?: { site_title?: string; site_description?: string; site_keywords?: string; og_image?: string } | null): SeoFields {
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
        home: "", about: "", services: "", gallery: "", videos: "", enquiry: "", contact: "",
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
      })) as { id: string; page_key: string; title: string; description: string; keywords: string; og_image: string }[];

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
        pages[p.page_key] = { title: p.title, description: p.description, keywords: p.keywords, og_image: p.og_image };
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
        footer: footerData,
        seo: { default: seoDefault, pages },
      };
    },
    staleTime: 30_000,
  });
}

export function useSettings() {
  return useQuery(settingsQueryOptions());
}

export const EMPTY_SETTINGS: SiteSettings = {
  hero: { title: "", subtitle: "", cta: "", badge: "" },
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
  about: { heading: "", body: "", years_experience: "", happy_customers: "", cities_covered: "" },
  contact: { phone: "", whatsapp: "", email: "", address: "", whatsapp_enquiry_message: "" },
  social: { facebook: "", instagram: "", youtube: "" },
  cta: { banner_text: "", banner_subtitle: "", banner_link: "", banner_button: "", show_banner: false },
  footer: { description: "", quick_links: "" },
  seo: { default: { title: "", description: "", keywords: "", og_image: "" }, pages: {} },
};

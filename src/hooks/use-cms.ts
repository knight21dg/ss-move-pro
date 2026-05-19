import { useQuery, useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const from = (table: string) => supabase.from(table as any);

export function useServices(activeOnly = true) {
  return useQuery({
    queryKey: ["services", activeOnly],
    queryFn: async () => {
      let q = supabase.from("services").select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGallery(activeOnly = true) {
  return useQuery({
    queryKey: ["gallery", activeOnly],
    queryFn: async () => {
      let q = supabase.from("gallery_images").select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useVideos(activeOnly = true) {
  return useQuery({
    queryKey: ["videos", activeOnly],
    queryFn: async () => {
      let q = supabase.from("videos").select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTestimonials(activeOnly = true) {
  return useQuery({
    queryKey: ["testimonials", activeOnly],
    queryFn: async () => {
      let q = supabase.from("testimonials").select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export type SeoFields = { title: string; description: string; keywords: string; og_image: string };

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

export interface HeroImages {
  home: string;
  about: string;
  services: string;
  gallery: string;
  videos: string;
  enquiry: string;
  contact: string;
}

export interface AboutSettings {
  heading: string;
  body: string;
  years_experience: string;
  happy_customers: string;
  cities_covered: string;
}

export interface WhyUsItem { title: string; desc: string }
export interface ProcessItem { step: string; title: string; desc: string }
export interface FaqItem { question: string; answer: string }

export interface HomeWhyUs  { eyebrow: string; title: string; items: WhyUsItem[] }
export interface HomeProcess { eyebrow: string; title: string; items: ProcessItem[] }
export interface HomeFaqs    { eyebrow: string; title: string; items: FaqItem[] }

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

export interface SeoSettings { default: SeoFields; pages: Record<string, SeoFields> }

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

export const EMPTY_SETTINGS: SiteSettings = {
  hero: { title: "", subtitle: "", cta: "", badge: "" },
  hero_images: { home: "", about: "", services: "", gallery: "", videos: "", enquiry: "", contact: "" },
  home_why_us: { eyebrow: "", title: "", items: [] },
  home_process: { eyebrow: "", title: "", items: [] },
  home_faqs: { eyebrow: "", title: "", items: [] },
  about: { heading: "", body: "", years_experience: "", happy_customers: "", cities_covered: "" },
  contact: { phone: "", whatsapp: "", email: "", address: "", whatsapp_enquiry_message: "" },
  social: { facebook: "", instagram: "", youtube: "" },
  cta: { banner_text: "", banner_subtitle: "", banner_link: "", banner_button: "", show_banner: false },
  footer: { description: "", quick_links: "" },
  seo: {
    default: { title: "", description: "", keywords: "", og_image: "" },
    pages: {},
  },
};

// ── individual table helpers ─────────────────────────────────────────────────

async function fetchSingleton<T>(table: string): Promise<T | null> {
  const q = from(table).select("*").eq("id", 1).single();
  const { data, error } = await q;
  if (error) throw error;
  return (data as T) ?? null;
}

export function useHero() {
  return useQuery({
    queryKey: ["hero_settings"],
    queryFn: () => fetchSingleton<{ title: string; subtitle: string; cta: string; badge: string }>("hero_settings"),
  });
}

export function useHeroImages() {
  return useQuery({
    queryKey: ["hero_images_settings"],
    queryFn: () => fetchSingleton<HeroImages>("hero_images_settings"),
  });
}

export function useHomeWhyUs() {
  return useQuery({
    queryKey: ["home_why_us_settings"],
    queryFn: () => fetchSingleton<{ content: Json }>("home_why_us_settings"),
  });
}

export function useHomeProcess() {
  return useQuery({
    queryKey: ["home_process_settings"],
    queryFn: () => fetchSingleton<{ content: Json }>("home_process_settings"),
  });
}

export function useHomeFaqs() {
  return useQuery({
    queryKey: ["home_faqs_settings"],
    queryFn: () => fetchSingleton<{ content: Json }>("home_faqs_settings"),
  });
}

export function useAbout() {
  return useQuery({
    queryKey: ["about_settings"],
    queryFn: () => fetchSingleton<AboutSettings>("about_settings"),
  });
}

export function useContact() {
  return useQuery({
    queryKey: ["contact_settings"],
    queryFn: () => fetchSingleton<ContactSettings>("contact_settings"),
  });
}

export function useSocial() {
  return useQuery({
    queryKey: ["social_settings"],
    queryFn: () => fetchSingleton<SocialSettings>("social_settings"),
  });
}

export function useSeoDefault() {
  return useQuery({
    queryKey: ["seo_default_settings"],
    queryFn: () =>
      fetchSingleton<{ site_title: string; site_description: string; site_keywords: string; og_image: string }>(
        "seo_default_settings",
      ),
  });
}

export function useSeoPages() {
  return useQuery({
    queryKey: ["seo_page_settings"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (from("seo_page_settings").select("*").order("page_key") as any);
      if (error) throw error;
      return (data ?? []) as { page_key: string; title: string; description: string; keywords: string; og_image: string }[];
    },
  });
}

export function useCta() {
  return useQuery({
    queryKey: ["cta_settings"],
    queryFn: () => fetchSingleton<CtaSettings>("cta_settings"),
  });
}

export function useFooter() {
  return useQuery({
    queryKey: ["footer_settings"],
    queryFn: () => fetchSingleton<FooterSettings>("footer_settings"),
  });
}

// ── combined settings hook ────────────────────────────────────────────────────

function pickSeoField(
  r?: { data?: { site_title?: string; site_description?: string; site_keywords?: string; og_image?: string } | null },
): SeoFields {
  return {
    title:       (r?.data?.site_title       ?? "") as string,
    description: (r?.data?.site_description  ?? "") as string,
    keywords:    (r?.data?.site_keywords     ?? "") as string,
    og_image:    (r?.data?.og_image          ?? "") as string,
  };
}

function parseHomeSection(
  r: { data: { content: Json } | null } | undefined,
  parseItem: (i: unknown) => unknown,
): { eyebrow: string; title: string; items: unknown[] } {
  const c = (r?.data?.content ?? null) as Record<string, unknown> | null;
  return {
    eyebrow: typeof c?.eyebrow === "string" ? c!.eyebrow : "",
    title:   typeof c?.title   === "string" ? c!.title   : "",
    items:   Array.isArray(c?.items) ? (c!.items as unknown[]).map(parseItem) : [],
  };
}

export function useSettings() {
  const results = useQueries({
    queries: [
      { queryKey: ["hero_settings"],         queryFn: () => fetchSingleton<{ title: string; subtitle: string; cta: string; badge: string }>("hero_settings") },
      { queryKey: ["hero_images_settings"],  queryFn: () => fetchSingleton<HeroImages>("hero_images_settings") },
      { queryKey: ["home_why_us_settings"],  queryFn: () => fetchSingleton<{ content: Json }>("home_why_us_settings") },
      { queryKey: ["home_process_settings"], queryFn: () => fetchSingleton<{ content: Json }>("home_process_settings") },
      { queryKey: ["home_faqs_settings"],    queryFn: () => fetchSingleton<{ content: Json }>("home_faqs_settings") },
      { queryKey: ["about_settings"],        queryFn: () => fetchSingleton<AboutSettings>("about_settings") },
      { queryKey: ["contact_settings"],      queryFn: () => fetchSingleton<ContactSettings>("contact_settings") },
      { queryKey: ["social_settings"],       queryFn: () => fetchSingleton<SocialSettings>("social_settings") },
      { queryKey: ["cta_settings"],          queryFn: () => fetchSingleton<CtaSettings>("cta_settings") },
      { queryKey: ["footer_settings"],       queryFn: () => fetchSingleton<FooterSettings>("footer_settings") },
      { queryKey: ["seo_default_settings"],  queryFn: () => fetchSingleton<{ site_title: string; site_description: string; site_keywords: string; og_image: string }>("seo_default_settings") },
      {
        queryKey: ["seo_page_settings"],
        queryFn: async (): Promise<{ page_key: string; title: string; description: string; keywords: string; og_image: string }[]> => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (from("seo_page_settings").select("*").order("page_key") as any);
          if (error) throw error;
          return (data ?? []) as { page_key: string; title: string; description: string; keywords: string; og_image: string }[];
        },
      },
    ],
  });

  const isLoading = results.some((r) => r.isLoading);
  if (isLoading) return { data: null, isLoading };

  const [
    hero, heroImages, whyUsRaw, processRaw, faqsRaw,
    about, contact, social, cta, footer, seoDefault, seoPages,
  ] = results;

  const parseWhyUsItem  = (i: unknown): WhyUsItem       => ({ title: String((i as Record<string, unknown>).title  ?? ""), desc: String((i as Record<string, unknown>).desc    ?? "") });
  const parseProcessItem = (i: unknown): ProcessItem    => ({ step:  String((i as Record<string, unknown>).step    ?? ""), title: String((i as Record<string, unknown>).title ?? ""), desc: String((i as Record<string, unknown>).desc  ?? "") });
  const parseFaqItem    = (i: unknown): FaqItem        => ({ question: String((i as Record<string, unknown>).question ?? ""), answer: String((i as Record<string, unknown>).answer ?? "") });

  const whyUs   = parseHomeSection(whyUsRaw.data  as any, parseWhyUsItem) as { eyebrow: string; title: string; items: WhyUsItem[] };
  const process = parseHomeSection(processRaw.data as any, parseProcessItem) as { eyebrow: string; title: string; items: ProcessItem[] };
  const faqs    = parseHomeSection(faqsRaw.data   as any, parseFaqItem) as { eyebrow: string; title: string; items: FaqItem[] };

  const pagesData = seoPages.data ?? [];
  const pages: Record<string, SeoFields> = {};
  for (const p of pagesData) {
    pages[p.page_key] = { title: p.title, description: p.description, keywords: p.keywords, og_image: p.og_image };
  }

  const out: SiteSettings = {
    hero:        hero.data          ?? EMPTY_SETTINGS.hero,
    hero_images: heroImages.data    ?? EMPTY_SETTINGS.hero_images,
    home_why_us:  { ...whyUs as HomeWhyUs },
    home_process: { ...process as HomeProcess },
    home_faqs:    { ...faqs as HomeFaqs  },
    about:       about.data         ?? EMPTY_SETTINGS.about,
    contact:     contact.data       ?? EMPTY_SETTINGS.contact,
    social:      social.data        ?? EMPTY_SETTINGS.social,
    cta:         cta.data           ?? EMPTY_SETTINGS.cta,
    footer:      footer.data        ?? EMPTY_SETTINGS.footer,
    seo: { default: pickSeoField(seoDefault), pages },
  };

  return { data: out, isLoading: false };
}

import { useQuery, useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const from = (table: string) => supabase.from(table as any);

export function useServices(activeOnly = true) {
   return useQuery({
     queryKey: ["services", activeOnly],
     queryFn: async () => {
       let q = from("services").select("*").order("sort_order");
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
       let q = from("gallery_images").select("*").order("sort_order");
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
       let q = from("videos").select("*").order("sort_order");
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
       let q = from("testimonials").select("*").order("sort_order");
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

export interface WhyUsItem {
  id: string;
  title: string;
  description: string;
  sort_order: number;
}
export interface ProcessItem {
  id: string;
  step: string;
  title: string;
  description: string;
  sort_order: number;
}
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
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

export interface SeoSettings {
  default: SeoFields;
  pages: Record<string, SeoFields>;
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
  cta: {
    banner_text: "",
    banner_subtitle: "",
    banner_link: "",
    banner_button: "",
    show_banner: false,
  },
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

async function fetchHomeSection<TItem>(config: {
  settingsTable: string;
  itemsTable: string;
  parseItem: (item: unknown, index: number) => TItem;
}): Promise<{ eyebrow: string; title: string; items: TItem[] }> {
  const { data: settings, error: settingsError } = await from(config.settingsTable)
    .select("content")
    .eq("id", 1)
    .single();
  if (settingsError) throw settingsError;

  const s = settings as { content?: unknown } | null;
  const fkColumn = `${config.settingsTable.replace(/_settings$/, "")}_settings_id`;

  let items: TItem[] = [];

  try {
    const { data: itemsData, error: itemsError } = await from(config.itemsTable)
      .select("*")
      .eq(fkColumn, 1)
      .order("sort_order");
    if (!itemsError && itemsData) {
      items = itemsData.map((item, idx) => config.parseItem(item, idx));
    }
  } catch {
    // items table doesn't exist, fall through to content fallback
  }

  const content = s?.content;
  if (content && typeof content === "object" && !Array.isArray(content)) {
    const c = content as { eyebrow?: string; title?: string; items?: unknown[] };
    if (items.length === 0) {
      const itemsArray = (c.items ?? []) as unknown[];
      items = itemsArray.map((item, idx) => config.parseItem(item, idx));
    }
    return {
      eyebrow: c.eyebrow ?? "",
      title: c.title ?? "",
      items,
    };
  }

  return { eyebrow: "", title: "", items };
}

export function useHero() {
  return useQuery({
    queryKey: ["hero_settings"],
    queryFn: () =>
      fetchSingleton<{ title: string; subtitle: string; cta: string; badge: string }>(
        "hero_settings",
      ),
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
    queryFn: () =>
      fetchHomeSection<WhyUsItem>({
        settingsTable: "home_why_us_settings",
        itemsTable: "home_why_us_items",
        parseItem: (item: unknown) => {
          const i = item as { id?: string; title?: string; description?: string; sort_order?: number };
          return {
            id: i.id ?? "",
            title: i.title ?? "",
            description: i.description ?? "",
            sort_order: i.sort_order ?? 0,
          };
        },
      }),
  });
}

export function useHomeProcess() {
  return useQuery({
    queryKey: ["home_process_settings"],
    queryFn: () =>
      fetchHomeSection<ProcessItem>({
        settingsTable: "home_process_settings",
        itemsTable: "home_process_items",
        parseItem: (item: unknown) => {
          const i = item as { id?: string; step?: string; title?: string; description?: string; sort_order?: number };
          return {
            id: i.id ?? "",
            step: i.step ?? "",
            title: i.title ?? "",
            description: i.description ?? "",
            sort_order: i.sort_order ?? 0,
          };
        },
      }),
  });
}

export function useHomeFaqs() {
  return useQuery({
    queryKey: ["home_faqs_settings"],
    queryFn: () =>
      fetchHomeSection<FaqItem>({
        settingsTable: "home_faqs_settings",
        itemsTable: "home_faqs_items",
        parseItem: (item: unknown) => {
          const i = item as { id?: string; question?: string; answer?: string; sort_order?: number };
          return {
            id: i.id ?? "",
            question: i.question ?? "",
            answer: i.answer ?? "",
            sort_order: i.sort_order ?? 0,
          };
        },
      }),
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
      fetchSingleton<{
        site_title: string;
        site_description: string;
        site_keywords: string;
        og_image: string;
      }>("seo_default_settings"),
  });
}

export function useSeoPages() {
  return useQuery({
    queryKey: ["seo_page_settings"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (from("seo_page_settings")
        .select("*")
        .order("page_key") as any);
      if (error) throw error;
      return (data ?? []) as {
        page_key: string;
        title: string;
        description: string;
        keywords: string;
        og_image: string;
      }[];
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

function pickSeoField(r?: {
  data?: {
    site_title?: string;
    site_description?: string;
    site_keywords?: string;
    og_image?: string;
  } | null;
}): SeoFields {
  return {
    title: (r?.data?.site_title ?? "") as string,
    description: (r?.data?.site_description ?? "") as string,
    keywords: (r?.data?.site_keywords ?? "") as string,
    og_image: (r?.data?.og_image ?? "") as string,
  };
}

export function useSettings() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["hero_settings"],
        queryFn: () =>
          fetchSingleton<{ title: string; subtitle: string; cta: string; badge: string }>(
            "hero_settings",
          ),
      },
      {
        queryKey: ["hero_images_settings"],
        queryFn: () => fetchSingleton<HeroImages>("hero_images_settings"),
      },
      {
        queryKey: ["home_why_us_settings"],
        queryFn: () =>
          fetchHomeSection<WhyUsItem>({
            settingsTable: "home_why_us_settings",
            itemsTable: "home_why_us_items",
            parseItem: (item) => {
              const i = item as { id?: string; title?: string; description?: string; sort_order?: number };
              return {
                id: i.id ?? "",
                title: i.title ?? "",
                description: i.description ?? "",
                sort_order: i.sort_order ?? 0,
              };
            },
          }),
      },
      {
        queryKey: ["home_process_settings"],
        queryFn: () =>
          fetchHomeSection<ProcessItem>({
            settingsTable: "home_process_settings",
            itemsTable: "home_process_items",
            parseItem: (item) => {
              const i = item as { id?: string; step?: string; title?: string; description?: string; sort_order?: number };
              return {
                id: i.id ?? "",
                step: i.step ?? "",
                title: i.title ?? "",
                description: i.description ?? "",
                sort_order: i.sort_order ?? 0,
              };
            },
          }),
      },
      {
        queryKey: ["home_faqs_settings"],
        queryFn: () =>
          fetchHomeSection<FaqItem>({
            settingsTable: "home_faqs_settings",
            itemsTable: "home_faqs_items",
            parseItem: (item) => {
              const i = item as { id?: string; question?: string; answer?: string; sort_order?: number };
              return {
                id: i.id ?? "",
                question: i.question ?? "",
                answer: i.answer ?? "",
                sort_order: i.sort_order ?? 0,
              };
            },
          }),
      },
      {
        queryKey: ["about_settings"],
        queryFn: () => fetchSingleton<AboutSettings>("about_settings"),
      },
      {
        queryKey: ["contact_settings"],
        queryFn: () => fetchSingleton<ContactSettings>("contact_settings"),
      },
      {
        queryKey: ["social_settings"],
        queryFn: () => fetchSingleton<SocialSettings>("social_settings"),
      },
      { queryKey: ["cta_settings"], queryFn: () => fetchSingleton<CtaSettings>("cta_settings") },
      {
        queryKey: ["footer_settings"],
        queryFn: () => fetchSingleton<FooterSettings>("footer_settings"),
      },
      {
        queryKey: ["seo_default_settings"],
        queryFn: () =>
          fetchSingleton<{
            site_title: string;
            site_description: string;
            site_keywords: string;
            og_image: string;
          }>("seo_default_settings"),
      },
      {
        queryKey: ["seo_page_settings"],
        queryFn: async (): Promise<
          {
            page_key: string;
            title: string;
            description: string;
            keywords: string;
            og_image: string;
          }[]
        > => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (from("seo_page_settings")
            .select("*")
            .order("page_key") as any);
          if (error) throw error;
          return (data ?? []) as {
            page_key: string;
            title: string;
            description: string;
            keywords: string;
            og_image: string;
          }[];
        },
      },
    ],
  });

  const isLoading = results.some((r) => r.isLoading);
  if (isLoading) return { data: null, isLoading };

  const [
    hero,
    heroImages,
    whyUsRaw,
    processRaw,
    faqsRaw,
    about,
    contact,
    social,
    cta,
    footer,
    seoDefault,
    seoPages,
  ] = results;

  const pagesData = seoPages.data ?? [];
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

  const out: SiteSettings = {
    hero: hero.data ?? EMPTY_SETTINGS.hero,
    hero_images: heroImages.data ?? EMPTY_SETTINGS.hero_images,
    home_why_us: whyUsRaw.data ?? EMPTY_SETTINGS.home_why_us,
    home_process: processRaw.data ?? EMPTY_SETTINGS.home_process,
    home_faqs: faqsRaw.data ?? EMPTY_SETTINGS.home_faqs,
    about: about.data ?? EMPTY_SETTINGS.about,
    contact: contact.data ?? EMPTY_SETTINGS.contact,
    social: social.data ?? EMPTY_SETTINGS.social,
    cta: cta.data ?? EMPTY_SETTINGS.cta,
    footer: footer.data ?? EMPTY_SETTINGS.footer,
    seo: { default: pickSeoField(seoDefault), pages },
  };

  return { data: out, isLoading: false };
}

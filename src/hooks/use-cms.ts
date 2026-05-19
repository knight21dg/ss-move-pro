import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export type SiteSettingValue = Record<string, unknown>;

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

export interface HomeWhyUs { eyebrow: string; title: string; items: WhyUsItem[] }
export interface HomeProcess { eyebrow: string; title: string; items: ProcessItem[] }
export interface HomeFaqs { eyebrow: string; title: string; items: FaqItem[] }

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
  hero: SiteSettingValue;
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
  hero: {},
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

export function useSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings | null> => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      if (!data || data.length === 0) return null;
      const out: Record<string, unknown> = {};
      for (const row of data) {
        out[row.key] = row.value;
      }
      return out as SiteSettings;
    },
  });
}

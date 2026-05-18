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

export type SiteSettings = {
  hero: { title: string; subtitle: string; cta: string };
  about: { heading: string; body: string; years_experience: string; happy_customers: string; cities_covered: string };
  contact: { phone: string; whatsapp: string; email: string; address: string };
  social: { facebook: string; instagram: string; youtube: string };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  hero: { title: "SS Packers & Movers", subtitle: "Trusted Relocation in Kakinada & Across India", cta: "Get Free Quote" },
  about: { heading: "About SS Packers & Movers", body: "We are a trusted relocation company based in Kakinada.", years_experience: "10+", happy_customers: "5000+", cities_covered: "100+" },
  contact: { phone: "+91 9876543210", whatsapp: "+91 9876543210", email: "info@sspackersmovers.in", address: "Kakinada, Andhra Pradesh, India" },
  social: { facebook: "", instagram: "", youtube: "" },
};

export function useSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const out: any = { ...DEFAULT_SETTINGS };
      for (const row of data ?? []) {
        out[row.key] = { ...(out[row.key] ?? {}), ...(row.value as any) };
      }
      return out as SiteSettings;
    },
  });
}

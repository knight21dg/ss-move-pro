import { useEffect, useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EMPTY_SETTINGS, useSettings, type SiteSettings } from "@/hooks/use-cms";

const SINGLETON_TABLES = [
  "hero_settings",
  "hero_images_settings",
  "about_settings",
  "contact_settings",
  "social_settings",
  "cta_settings",
  "footer_settings",
  "ga_settings",
  "seo_default_settings",
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const from = (table: string) => supabase.from(table as any);

async function upsertSingleton(table: string, values: Record<string, unknown>) {
  const { error } = await from(table).upsert(values, { onConflict: "id" });
  if (error) throw error;
}

async function updateSingletonContent(table: string, content: Record<string, unknown>) {
  const { error } = await from(table).update({ content }).eq("id", 1);
  if (error) throw error;
}

async function upsertSeoPages(pages: SiteSettings["seo"]["pages"]) {
  const rows = Object.entries(pages).map(([page_key, val]) => ({
    page_key,
    title: val.title,
    description: val.description,
    keywords: val.keywords,
    og_image: val.og_image,
  }));
  // Upsert each page on conflict of page_key
  for (const row of rows) {
    const { error } = await from("seo_page_settings").upsert(row, { onConflict: "page_key" });
    if (error) throw error;
  }
}

export function useSettingsForm() {
  const { data, isLoading } = useSettings();
  const qc = useQueryClient();
  const [form, _setFormRaw] = useState<SiteSettings>(EMPTY_SETTINGS);
  const isLoaded = useRef(false);

  // Only set form state on initial load, not on refetches
  useEffect(() => {
    if (data && !isLoaded.current) {
      _setFormRaw(data);
      isLoaded.current = true;
    }
  }, [data]);

  const setForm = (updater: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => {
    if (typeof updater === "function") {
      _setFormRaw((prev) => (updater as (s: SiteSettings) => SiteSettings)(prev));
    } else {
      _setFormRaw(updater);
    }
  };

  const save = useMutation({
    mutationFn: async (): Promise<void> => {
      await upsertSingleton("hero_settings", {
        id: 1,
        title: form.hero.title,
        subtitle: form.hero.subtitle,
        cta: form.hero.cta,
        badge: form.hero.badge,
      });

      await upsertSingleton("hero_images_settings", {
        id: 1,
        home: form.hero_images.home,
        about: form.hero_images.about,
        services: form.hero_images.services,
        gallery: form.hero_images.gallery,
        videos: form.hero_images.videos,
        enquiry: form.hero_images.enquiry,
        contact: form.hero_images.contact,
      });

      await updateSingletonContent("home_why_us_settings", form.home_why_us as unknown as Record<string, unknown>);
      await updateSingletonContent("home_process_settings", form.home_process as unknown as Record<string, unknown>);
      await updateSingletonContent("home_faqs_settings", form.home_faqs as unknown as Record<string, unknown>);

      await upsertSingleton("about_settings", {
        id: 1,
        heading: form.about.heading,
        body: form.about.body,
        years_experience: form.about.years_experience,
        happy_customers: form.about.happy_customers,
        cities_covered: form.about.cities_covered,
      });

      await upsertSingleton("contact_settings", {
        id: 1,
        phone: form.contact.phone,
        whatsapp: form.contact.whatsapp,
        email: form.contact.email,
        address: form.contact.address,
        whatsapp_enquiry_message: form.contact.whatsapp_enquiry_message,
      });

      await upsertSingleton("social_settings", {
        id: 1,
        facebook: form.social.facebook,
        instagram: form.social.instagram,
        youtube: form.social.youtube,
      });

      await upsertSingleton("cta_settings", {
        id: 1,
        banner_text: form.cta.banner_text,
        banner_subtitle: form.cta.banner_subtitle,
        banner_link: form.cta.banner_link,
        banner_button: form.cta.banner_button,
        show_banner: form.cta.show_banner,
      });

      await upsertSingleton("footer_settings", {
        id: 1,
        description: form.footer.description,
        quick_links: form.footer.quick_links,
      });

      await upsertSingleton("seo_default_settings", {
        id: 1,
        site_title: form.seo.default.title,
        site_description: form.seo.default.description,
        site_keywords: form.seo.default.keywords,
        og_image: form.seo.default.og_image,
      });

      await upsertSeoPages(form.seo.pages);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hero_settings"] });
      qc.invalidateQueries({ queryKey: ["hero_images_settings"] });
      qc.invalidateQueries({ queryKey: ["home_why_us_settings"] });
      qc.invalidateQueries({ queryKey: ["home_process_settings"] });
      qc.invalidateQueries({ queryKey: ["home_faqs_settings"] });
      qc.invalidateQueries({ queryKey: ["about_settings"] });
      qc.invalidateQueries({ queryKey: ["contact_settings"] });
      qc.invalidateQueries({ queryKey: ["social_settings"] });
      qc.invalidateQueries({ queryKey: ["cta_settings"] });
      qc.invalidateQueries({ queryKey: ["footer_settings"] });
      qc.invalidateQueries({ queryKey: ["seo_default_settings"] });
      qc.invalidateQueries({ queryKey: ["seo_page_settings"] });
      toast.success("Saved");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to save"),
  });

  return { form, setForm, isLoading, save };
}

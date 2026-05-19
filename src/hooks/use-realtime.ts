import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TABLES = [
  "hero_settings",
  "hero_images_settings",
  "home_why_us_settings",
  "home_process_settings",
  "home_faqs_settings",
  "about_settings",
  "contact_settings",
  "social_settings",
  "cta_settings",
  "footer_settings",
  "seo_default_settings",
  "seo_page_settings",
  "ga_settings",
  "services",
  "gallery_images",
  "testimonials",
  "videos",
  "enquiries",
] as const;

/**
 * Subscribes to Supabase realtime CDC events for all CMS tables.
 * On any INSERT / UPDATE / DELETE, the matching TanStack Query cache is invalidated
 * so the UI refreshes automatically without a page reload.
 */
export function useRealtime() {
  const qc = useQueryClient();
  const subsRef = useRef<Record<string, ReturnType<typeof supabase.channel>>>({});

  useEffect(() => {
    for (const table of TABLES) {
      // idempotent — skip if already subscribed
      if (subsRef.current[table]) continue;

      const channel = supabase
        .channel(`realtime:${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => {
            qc.invalidateQueries({ queryKey: [table], exact: false });
            if (table === "enquiries") {
              qc.invalidateQueries({ queryKey: ["admin-stats"], exact: false });
            }
          }
        )
        .subscribe();

      subsRef.current[table] = channel;
    }

    return () => {
      for (const [table, channel] of Object.entries(subsRef.current)) {
        void supabase.removeChannel(channel);
        delete subsRef.current[table];
      }
    };
  }, [qc]);
}

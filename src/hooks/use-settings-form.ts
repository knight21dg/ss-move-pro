import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EMPTY_SETTINGS, useSettings, type SiteSettings } from "@/hooks/use-cms";

export function useSettingsForm() {
  const { data, isLoading } = useSettings();
  const qc = useQueryClient();
  const [form, _setFormRaw] = useState<SiteSettings>(EMPTY_SETTINGS);

  useEffect(() => {
    if (data) _setFormRaw(data);
  }, [data]);

  const setForm = (updater: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => {
    if (typeof updater === "function") {
      _setFormRaw((updater as (s: SiteSettings) => SiteSettings)(form));
    } else {
      _setFormRaw(updater);
    }
  };

  const save = useMutation({
    mutationFn: async () => {
      const rows = Object.entries(form).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from("site_settings").upsert(rows as any, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return { form, setForm, isLoading, save };
}

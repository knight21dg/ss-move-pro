
import { useQuery, QueryClient } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";

export function GoogleAnalytics({ queryClient }: { queryClient: QueryClient }) {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .eq("key", "ga_measurement_id");
      if (error) throw error;
      return data?.[0] ?? null;
    },
    enabled: !!queryClient,
  }, queryClient);

  const gaMeasurementId = (settings?.value as any)?.ga_measurement_id;

  if (!gaMeasurementId) {
    return null;
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `,
        }}
      ></script>
    </>
  );
}

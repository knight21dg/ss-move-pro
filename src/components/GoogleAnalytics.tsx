
import { useQuery, QueryClient } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";

export function GoogleAnalytics({ queryClient }: { queryClient: QueryClient }) {
  const { data: row } = useQuery({
    queryKey: ["ga_settings"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from("ga_settings")
        .select("ga_measurement_id")
        .eq("id", 1)
        .single() as any);
      if (error) throw error;
      return data;
    },
    enabled: !!queryClient,
  }, queryClient);

  const gaMeasurementId = row?.ga_measurement_id ?? "";

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

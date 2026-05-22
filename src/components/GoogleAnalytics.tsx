import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function GoogleAnalytics() {
  const { data: row } = useQuery({
    queryKey: ["ga_settings"],
    queryFn: async () => {
      const snap = await getDoc(doc(db, "ga_settings", "singleton"));
      return (snap.data() as { ga_measurement_id?: string } | undefined) ?? null;
    },
  });

  const gaMeasurementId = row?.ga_measurement_id ?? "";

  if (!gaMeasurementId) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `,
        }}
      />
    </>
  );
}

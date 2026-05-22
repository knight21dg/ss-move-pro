import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { useEffect } from "react";
import { useSettings } from "@/hooks/use-cms";

export const Route = createFileRoute("/kakinada" as any)({
  component: KakinadaPage as any,
  head: () => ({
    meta: [
      { title: "Packers and Movers Kakinada — SS Packers & Movers" },
      {
        name: "description",
        content:
          "Local and intercity household, office, bike and car transportation from Kakinada by SS Packers & Movers.",
      },
    ],
  }),
});

function KakinadaPage() {
  const { data: s } = useSettings();
  const phone = s?.contact?.phone ?? "";

  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SS Packers & Movers Mini Transport - Kakinada",
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kakinada",
      addressRegion: "Andhra Pradesh",
    },
    areaServed: ["Kakinada", "Rajahmundry", "Visakhapatnam", "Vijayawada", "Hyderabad"],
  };

  return (
    <SiteLayout>
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
      <PageHero
        eyebrow="Service Area"
        title="Packers & Movers in Kakinada"
        subtitle="Local and intercity household, office and vehicle shifting services from Kakinada. Reliable, insured and on-time delivery."
      />
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-3">Local Packers and Movers in Kakinada</h2>
        <p className="text-muted-foreground mb-4">
          SS Packers & Movers Mini Transport provides professional moving services in Kakinada —
          household shifting, office relocation, bike and car transport, mini transport and secure
          warehousing.
        </p>
        <h3 className="font-semibold mt-6">Why choose us in Kakinada</h3>
        <ul className="list-disc ml-6 mt-2 text-muted-foreground">
          <li>Experienced local teams and careful packing</li>
          <li>Transparent pricing and written estimates</li>
          <li>Door-to-door pickup and delivery</li>
        </ul>
        <div className="mt-6">
          <Link to="/enquiry" className="text-primary font-semibold">
            Get a free moving quote
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

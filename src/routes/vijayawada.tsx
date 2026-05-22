import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { useEffect } from "react";
import { useSettings } from "@/hooks/use-cms";

export const Route = createFileRoute("/vijayawada" as any)({ component: VijayawadaPage as any });

function VijayawadaPage() {
  const { data: s } = useSettings();
  const phone = s?.contact?.phone ?? "";

  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SS Packers & Movers Mini Transport - Vijayawada",
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vijayawada",
      addressRegion: "Andhra Pradesh",
    },
  };

  return (
    <SiteLayout>
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
      <PageHero
        eyebrow="Service Area"
        title="Packers & Movers in Vijayawada"
        subtitle="Reliable household and office relocation services from Vijayawada."
      />
      <section className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground">
          We offer secure packing, loading, transit and delivery with experienced staff in
          Vijayawada.
        </p>
        <div className="mt-6">
          <Link to="/enquiry" className="text-primary font-semibold">
            Request a quote
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

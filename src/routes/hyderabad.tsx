import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { useEffect } from "react";
import { useSettings } from "@/hooks/use-cms";

export const Route = createFileRoute("/hyderabad" as any)({ component: HyderabadPage as any });

function HyderabadPage() {
  const { data: s } = useSettings();
  const phone = s?.contact?.phone ?? "";

  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SS Packers & Movers Mini Transport - Hyderabad",
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
    },
  };

  return (
    <SiteLayout>
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
      <PageHero
        eyebrow="Service Area"
        title="Packers & Movers in Hyderabad"
        subtitle="Professional relocation and vehicle transport services serving Hyderabad and surrounding areas."
      />
      <section className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground">
          We handle local and long-distance moves from Hyderabad with insured transit and careful
          handling.
        </p>
        <div className="mt-6">
          <Link to="/enquiry" className="text-primary font-semibold">
            Get a quote
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

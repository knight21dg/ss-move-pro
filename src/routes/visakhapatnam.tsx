import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { useEffect } from "react";
import { useSettings } from "@/hooks/use-cms";

export const Route = createFileRoute("/visakhapatnam" as any)({
  component: VisakhapatnamPage as any,
});

function VisakhapatnamPage() {
  const { data: s } = useSettings();
  const phone = s?.contact?.phone ?? "";

  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SS Packers & Movers Mini Transport - Visakhapatnam",
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Visakhapatnam",
      addressRegion: "Andhra Pradesh",
    },
  };

  return (
    <SiteLayout>
      <script type="application/ld+json">{JSON.stringify(ld)}</script>
      <PageHero
        eyebrow="Service Area"
        title="Packers & Movers in Visakhapatnam"
        subtitle="Comprehensive relocation and vehicle transport services in Visakhapatnam."
      />
      <section className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground">
          Local and intercity moves handled by experienced professionals in Visakhapatnam.
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

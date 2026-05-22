import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { useEffect } from "react";
import { useSettings } from "@/hooks/use-cms";

export const Route = createFileRoute("/vijayawada")({ component: VijayawadaPage as any });

function insertLd(obj: any) {
  if (typeof document === "undefined") return;
  const id = "ld-json-city";
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.id = id;
  s.text = JSON.stringify(obj);
  document.head.appendChild(s);
}

function VijayawadaPage() {
  const { data: s } = useSettings();
  const phone = s?.contact?.phone ?? "";
  useEffect(() => {
    insertLd({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "SS Packers & Movers Mini Transport - Vijayawada",
      telephone: phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vijayawada",
        addressRegion: "Andhra Pradesh",
      },
    });
  }, [phone]);

  return (
    <SiteLayout>
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

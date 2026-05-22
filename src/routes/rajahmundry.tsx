import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { useEffect } from "react";
import { useSettings } from "@/hooks/use-cms";

export const Route = createFileRoute("/rajahmundry")({ component: RajahmundryPage as any });

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

function RajahmundryPage() {
  const { data: s } = useSettings();
  const phone = s?.contact?.phone ?? "";
  useEffect(() => {
    insertLd({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "SS Packers & Movers Mini Transport - Rajahmundry",
      telephone: phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rajahmundry",
        addressRegion: "Andhra Pradesh",
      },
    });
  }, [phone]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Service Area"
        title="Packers & Movers in Rajahmundry"
        subtitle="Local and intercity household, office and vehicle shifting services from Rajahmundry."
      />
      <section className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground">
          We provide reliable relocation services in Rajahmundry including packing, loading, transit
          and delivery.
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

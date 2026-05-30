import { Link } from "@tanstack/react-router";
import { PageHero } from "@/routes/about";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useCities, useSettings } from "@/hooks/use-cms";

export function CityPage({ slug }: { slug: string }) {
  const { data: cities = [] } = useCities(true);
  const { data: s } = useSettings();
  const city = cities.find((c) => c.slug === slug);
  const heroImage = city?.hero_image || s?.hero_images?.services;
  const phone = s?.contact?.phone ?? "";
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "";
  const bodyParts = city?.body?.split("\n")?.filter(Boolean) ?? [];
  const name = city?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Service Area"
        title={city?.hero_title || `Packers & Movers in ${name}`}
        subtitle={city?.hero_subtitle || `Professional relocation services in ${name}.`}
        backgroundImage={heroImage}
      />
      <section className="container mx-auto px-4 py-16 md:py-20 max-w-4xl">
        {bodyParts.length > 0 ? (
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {bodyParts.map((para, i) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            We provide reliable relocation services in {name} including packing, loading, transit and delivery.
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild variant="brand" size="lg" style={{ ...(s?.cta?.cta_bg_color ? { background: s.cta.cta_bg_color } : {}), ...(s?.cta?.cta_text_color ? { color: s.cta.cta_text_color } : {}) }}>
            <Link to="/enquiry" search={{ service: undefined }}>Get Free Quote</Link>
          </Button>
          {phone && (
            <Button asChild variant="outline" size="lg" style={{ ...(s?.cta?.call_bg_color ? { backgroundColor: s.cta.call_bg_color, borderColor: s.cta.call_bg_color } : {}), ...(s?.cta?.call_text_color ? { color: s.cta.call_text_color } : {}) }}>
              <a href={phoneHref}><Phone /> Call Now</a>
            </Button>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

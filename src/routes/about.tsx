import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2, Target, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-cms";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SS Packers & Movers Kakinada" },
      { name: "description", content: "Learn about SS Packers & Movers — Kakinada's trusted relocation company serving households and businesses across India." },
      { property: "og:title", content: "About SS Packers & Movers Kakinada" },
      { property: "og:description", content: "Trusted relocation company from Kakinada." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: s } = useSettings();
  const about = s?.about;
  const heroImage = s?.hero_images?.about;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About Us"
        title="Moving families and businesses with care since day one"
        subtitle="SS Packers & Movers is a Kakinada-based relocation company built on trust, reliability and customer-first service."
        backgroundImage={heroImage}
      />
      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <h2 className="text-3xl md:text-4xl font-extrabold">{about?.heading ?? "Your trusted relocation partner in Kakinada"}</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {about?.body ?? "For over 10 years, SS Packers & Movers has been helping families and businesses relocate safely across Andhra Pradesh and all over India."}
          </p>
          <ul className="space-y-2 pt-2">
            {["Licensed & insured operations", "Trained professional crew", "Transparent pricing, no hidden fees", "Dedicated customer support 24/7"].map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-5 w-5 text-primary" /> {t}</li>
            ))}
          </ul>
          <Button asChild variant="brand" size="lg" className="mt-4"><Link to="/enquiry">Get Free Quote</Link></Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Users, value: about?.happy_customers ?? "5000+", label: "Customers" },
            { icon: Award, value: about?.years_experience ?? "10+", label: "Years" },
            { icon: Target, value: about?.cities_covered ?? "100+", label: "Cities" },
            { icon: CheckCircle2, value: "99%", label: "On-Time" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-6">
              <Icon className="h-7 w-7 text-primary mb-3" />
              <div className="text-3xl font-extrabold">{value}</div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          {[
            { title: "Our Mission", text: "To deliver safe, transparent and stress-free relocation experiences for every customer." },
            { title: "Our Vision", text: "To be the most trusted name in packing and moving services across India." },
            { title: "Our Values", text: "Integrity, care, punctuality and continuous improvement in everything we do." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl bg-card p-7 border border-border">
              <h3 className="font-bold text-xl mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

export function PageHero({ eyebrow, title, subtitle, backgroundImage }: { eyebrow: string; title: string; subtitle?: string; backgroundImage?: string }) {
  const hasImage = Boolean(backgroundImage);
  return (
    <section className={hasImage ? "relative overflow-hidden text-white" : "bg-gradient-dark text-white"}>
      {hasImage && (
        <div className="absolute inset-0">
          <img src={backgroundImage} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
      )}
      <div className="relative container mx-auto px-4 py-20 md:py-28 text-center max-w-3xl">
        <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">{eyebrow}</div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-balance">{title}</h1>
        {subtitle && <p className="mt-5 text-white/80 text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}

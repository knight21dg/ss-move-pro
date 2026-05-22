import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, CheckCircle2, Target, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { useSettings, settingsQueryOptions } from "@/hooks/use-cms";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SS Packers & Movers Kakinada" },
      { name: "description", content: "Learn about SS Packers & Movers — Kakinada's trusted relocation company serving households and businesses across India." },
      { property: "og:title", content: "About SS Packers & Movers Kakinada" },
      { property: "og:description", content: "Trusted relocation company from Kakinada." },
    ],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(settingsQueryOptions());
    } catch (error) {
      console.error("Error prefetching data for about route:", error);
    }
  },
  component: AboutPage,
});

function AboutPage() {
  const { data: s, isLoading } = useSettings();
  const about = s?.about;
  const heroImage = s?.hero_images?.about;

  if (isLoading) {
    return (
      <SiteLayout>
        <section className="relative overflow-hidden">
          <div className="h-[50vh] min-h-[360px] w-full bg-muted" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </section>
        <section className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <div className="h-8 w-8 bg-muted rounded-xl animate-pulse" />
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                <div className="h-3 w-12 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About Us"
        title={about?.heading || ""}
        subtitle={about?.body || ""}
        backgroundImage={heroImage}
      />
      {about && (
      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          {about.heading && <h2 className="text-3xl md:text-4xl font-extrabold">{about.heading}</h2>}
          {about.body && (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {about.body}
            </p>
          )}
          <Button asChild variant="brand" size="lg" className="mt-4"><Link to="/enquiry">Get Free Quote</Link></Button>
        </div>
        {about.happy_customers || about.years_experience || about.cities_covered ? (
          <div className="grid grid-cols-3 gap-4">
            {about.happy_customers ? <StatCard icon={Users} value={about.happy_customers} label="Customers" /> : null}
            {about.years_experience ? <StatCard icon={Award} value={about.years_experience} label="Years" /> : null}
            {about.cities_covered ? <StatCard icon={Target} value={about.cities_covered} label="Cities" /> : null}
          </div>
        ) : null}
      </section>
      )}
    </SiteLayout>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <Icon className="h-7 w-7 text-primary mb-3" />
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle, backgroundImage }: { eyebrow?: string; title: string; subtitle?: string; backgroundImage?: string }) {
  const hasImage = Boolean(backgroundImage);
  const optimizedImage = backgroundImage ? optimizeCloudinaryUrl(backgroundImage, 1200) : undefined;
  return (
    <section className={hasImage ? "relative overflow-hidden text-white" : "bg-gradient-dark text-white"}>
      {hasImage && (
        <div className="absolute inset-0">
          <img src={optimizedImage} alt={title} className="h-full w-full object-cover" />
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

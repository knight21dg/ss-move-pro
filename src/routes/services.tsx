import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { PageHero } from "./about";
import { useServices, useSettings } from "@/hooks/use-cms";
import { getIcon } from "@/lib/icons";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — SS Packers & Movers Kakinada" },
      { name: "description", content: "Household shifting, office relocation, car transport, warehousing, loading & unloading and more — across India from Kakinada." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services = [], isLoading } = useServices();
  const { data: s } = useSettings();
  const heroImage = s?.hero_images?.services;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Services"
        title="Complete relocation solutions"
        subtitle="From a single carton to a full office, we handle moves of every size with the same professionalism."
        backgroundImage={heroImage}
      />
      <section className="container mx-auto px-4 py-16">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-muted-foreground">No services available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <div key={s.id} className="group rounded-2xl bg-card border border-border p-7 hover:shadow-brand hover:-translate-y-1 transition-all">
                  {s.image_url ? (
                    <div className="aspect-video rounded-xl overflow-hidden mb-5 -mx-2 -mt-2">
                      <img src={s.image_url} alt={s.title} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-14 w-14 rounded-2xl bg-gradient-brand text-white flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7" />
                    </div>
                  )}
                  <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.description}</p>
                  <Link to="/enquiry" className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Enquire <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-3xl bg-gradient-brand p-10 md:p-14 text-center text-white shadow-brand">
          <h2 className="text-3xl md:text-4xl font-extrabold">Not sure which service you need?</h2>
          <p className="mt-3 text-white/90">Tell us your move details and we'll recommend the best plan.</p>
          <Button asChild variant="hero" size="lg" className="mt-7 h-12 px-8"><Link to="/enquiry">Get Free Consultation</Link></Button>
        </div>
      </section>
    </SiteLayout>
  );
}

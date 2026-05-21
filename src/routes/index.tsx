import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Clock, MessageCircle, Phone, ShieldCheck, Star, Truck } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGallery, useServices, useSettings, useTestimonials, EMPTY_SETTINGS } from "@/hooks/use-cms";
import type { WhyUsItem, ProcessItem, FaqItem } from "@/hooks/use-cms";
import { useRealtime } from "@/hooks/use-realtime";
import { getIcon } from "@/lib/icons";

const iconList = [ShieldCheck, Clock, Award, Truck];

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  useRealtime();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: testimonials = [], isLoading: testimonialsLoading } = useTestimonials();
  const { data: gallery = [], isLoading: galleryLoading } = useGallery();

  const s = settings ?? EMPTY_SETTINGS;
  const hero = s.hero;
  const about = s.about;
  const contact = s.contact;
  const heroImages = s.hero_images;
  const whyUsSection = s.home_why_us;
  const processSection = s.home_process;
  const faqSection = s.home_faqs;
  const cta = s.cta;
  const phone = contact?.phone;
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "";
  const wa = contact?.whatsapp ? contact.whatsapp.replace(/\D/g, "") : "";

  const loading = settingsLoading || servicesLoading || testimonialsLoading || galleryLoading;

  if (loading) {
    return <HomeSkeleton />;
  }

  const stats = about?.happy_customers || about?.years_experience || about?.cities_covered
    ? [
        about?.happy_customers ? { value: about.happy_customers, label: "Happy Customers" } : null,
        about?.years_experience ? { value: about.years_experience, label: "Years Experience" } : null,
        about?.cities_covered ? { value: about.cities_covered, label: "Cities Served" } : null,
      ].filter(Boolean) as { value: string; label: string }[]
    : [];

  const galleryItems = gallery.slice(0, 4).map((g) => g.image_url);
  const heroBackground = heroImages?.home;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {heroBackground ? (
            <img
              src={heroBackground}
              alt={(hero?.title as string) ?? "Hero background"}
              className="h-full w-full object-cover"
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full bg-gradient-dark" />
          )}
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="relative container mx-auto px-4 py-28 md:py-40 max-w-5xl">
          {(hero?.badge as string) !== "" && (
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-medium text-white border border-white/20 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {hero.badge as string}
            </div>
          )}
          {(hero?.title as string) !== "" && (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white text-balance leading-[1.05]">
              {hero.title as string}
            </h1>
          )}
          {(hero?.subtitle as string) !== "" && (
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
              {hero.subtitle as string}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {(hero?.cta as string) !== "" && (
              <Button asChild size="lg" variant="hero" className="h-12 px-7 text-base">
                <Link to="/enquiry">{(hero.cta as string)} <ArrowRight /></Link>
              </Button>
            )}
            {phone && (
              <Button asChild size="lg" variant="brand" className="h-12 px-7 text-base">
                <a href={phoneHref}><Phone /> Call Now</a>
              </Button>
            )}
            {wa && (
              <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      {stats.length > 0 && (
        <section className="bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-3 gap-6">
            {stats.map((st) => (
              <div key={st.label} className="text-center" style={{ contentVisibility: "auto" } as React.CSSProperties}>
                <div className="text-3xl md:text-4xl font-extrabold text-primary">{st.value}</div>
                <div className="text-sm text-white/70 mt-1">{st.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* WHY US */}
      {whyUsSection?.items?.length > 0 && (
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">{whyUsSection.eyebrow}</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-balance">{whyUsSection.title}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12" style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" } as React.CSSProperties}>
            {whyUsSection.items.map(({ title, description }, index) => {
              const Icon = iconList[index] ?? ShieldCheck;
              return (
              <div key={title} className="group rounded-2xl border border-border bg-card p-7 hover:shadow-brand hover:-translate-y-1 transition-all">
                <div className="h-12 w-12 rounded-xl bg-gradient-brand text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            );})}
          </div>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">Our Services</div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-balance">End-to-end relocation services</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12" style={{ contentVisibility: "auto", containIntrinsicSize: "0 800px" } as React.CSSProperties}>
              {services.slice(0, 8).map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <div key={s.id} className="rounded-2xl bg-card border border-border p-6 hover:border-primary hover:shadow-brand transition-all">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="brand" size="lg"><Link to="/services">View All Services <ArrowRight /></Link></Button>
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      {processSection?.items?.length > 0 && (
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">{processSection?.eyebrow}</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-balance">{processSection?.title}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 mt-12" style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" } as React.CSSProperties}>
            {processSection.items.map((p) => (
              <div key={p.step} className="relative rounded-2xl bg-card border border-border p-7">
                <div className="text-5xl font-extrabold text-primary/20 absolute top-4 right-5">{p.step}</div>
                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GALLERY PREVIEW */}
      {galleryItems.length > 0 && (
        <section className="container mx-auto px-4 pb-20 md:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">Gallery</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-balance">Inside our daily operations</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12" style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" } as React.CSSProperties}>
            {galleryItems.map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-2xl">
                <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg"><Link to="/gallery">View Gallery <ArrowRight /></Link></Button>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">Testimonials</div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-balance">What our customers say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-12" style={{ contentVisibility: "auto", containIntrinsicSize: "0 800px" } as React.CSSProperties}>
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} className="rounded-2xl bg-card border border-border p-7">
                  <div className="flex gap-1 text-primary mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-foreground/85 leading-relaxed mb-5">"{t.message}"</p>
                  <div className="flex items-center gap-3">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-brand text-white flex items-center justify-center font-bold">{t.name[0]}</div>
                    )}
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqSection.items.length > 0 && (
        <section className="container mx-auto px-4 py-20 md:py-28 max-w-4xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">{faqSection.eyebrow}</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-balance">{faqSection.title}</h2>
          </div>
          <div className="space-y-3 mt-12">
            {faqSection?.items?.map((f) => (
              <details key={f.question} className="group rounded-xl border border-border bg-card p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between gap-4 font-semibold">
                  {f.question}
                  <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center group-open:bg-primary group-open:text-primary-foreground transition-colors">+</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {cta?.show_banner && (
        <section className="container mx-auto px-4 pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 md:p-16 text-center shadow-brand">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="relative">
              {cta.banner_text && (
                <h2 className="text-3xl md:text-5xl font-extrabold text-white text-balance">{cta.banner_text}</h2>
              )}
              {cta.banner_subtitle && (
                <p className="mt-4 text-white/90 max-w-xl mx-auto">{cta.banner_subtitle}</p>
              )}
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                {cta.banner_button && cta.banner_link && (
                  <Button asChild size="lg" variant="hero" className="h-12 px-8 text-base">
                    <Link to={cta.banner_link}>{cta.banner_button}</Link>
                  </Button>
                )}
                {phone && (
                  <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent text-white border-white hover:bg-white hover:text-primary">
                    <a href={phoneHref}><Phone /> Call Now</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

function HomeSkeleton() {
  return (
    <SiteLayout>
      {/* Hero skeleton */}
      <section className="relative overflow-hidden">
        <div className="h-[70vh] min-h-[480px] w-full bg-muted" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative container mx-auto px-4 py-28 md:py-40 max-w-5xl space-y-6">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-16 md:h-20 w-4/5" />
          <Skeleton className="h-6 w-3/5" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 w-36 rounded-lg" />
            <Skeleton className="h-12 w-36 rounded-lg" />
            <Skeleton className="h-12 w-36 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Stats skeleton */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-9 w-24 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* Why Us skeleton */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <Skeleton className="h-3 w-20 mx-auto" />
          <Skeleton className="h-8 w-2/3 mx-auto" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-7 space-y-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>

      {/* Services skeleton */}
      <section className="bg-muted/50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <Skeleton className="h-3 w-20 mx-auto" />
            <Skeleton className="h-8 w-2/3 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">{eyebrow}</div>
      <h2 className="text-3xl md:text-5xl font-extrabold text-balance">{title}</h2>
    </div>
  );
}

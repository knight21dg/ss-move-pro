import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Clock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import {
  useGallery,
  useServices,
  useSettings,
  useTestimonials,
  EMPTY_SETTINGS,
  settingsQueryOptions,
  servicesQueryOptions,
  testimonialsQueryOptions,
  galleryQueryOptions,
} from "@/hooks/use-cms";
import type { WhyUsItem, ProcessItem, FaqItem } from "@/hooks/use-cms";
import { getIcon } from "@/lib/icons";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

const iconList = [ShieldCheck, Clock, Award, Truck];

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    try {
      await Promise.all([
        context.queryClient.ensureQueryData(settingsQueryOptions()),
        context.queryClient.ensureQueryData(servicesQueryOptions(true)),
        context.queryClient.ensureQueryData(testimonialsQueryOptions(true)),
        context.queryClient.ensureQueryData(galleryQueryOptions(true)),
      ]);
    } catch (error) {
      console.error("Error prefetching data for home route:", error);
    }
  },
  component: HomePage,
});

function HomePage() {
  const { data: settings } = useSettings();
  const { data: services = [] } = useServices();
  const { data: testimonials = [] } = useTestimonials();
  const { data: gallery = [] } = useGallery();

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

  const stats =
    about?.happy_customers || about?.years_experience || about?.successful_shifts || about?.service_locations
      ? ([
          about?.happy_customers
            ? { value: about.happy_customers, label: "Happy Customers" }
            : null,
          about?.years_experience
            ? { value: about.years_experience, label: "Years Experience" }
            : null,
          about?.successful_shifts
            ? { value: about.successful_shifts, label: "Successful Shifts" }
            : null,
          about?.service_locations
            ? { value: about.service_locations, label: "Service Locations" }
            : null,
        ].filter(Boolean) as { value: string; label: string }[])
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
              src={optimizeCloudinaryUrl(heroBackground, 1200)}
              alt={(hero?.title as string) ?? "Hero background"}
              className="h-full w-full object-cover"
              width={1200}
              height={675}
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
                <Link to="/enquiry" search={{ service: undefined }}>
                  {hero.cta as string} <ArrowRight />
                </Link>
              </Button>
            )}
            {phone && (
              <Button asChild size="lg" variant="brand" className="h-12 px-7 text-base">
                <a href={phoneHref}>
                  <Phone /> Call Now
                </a>
              </Button>
            )}
            {wa && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-7 text-base bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
              >
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                  <MessageCircle /> WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      {stats.length > 0 && (
        <section className="bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((st) => (
              <div
                key={st.label}
                className="text-center"
                style={{ contentVisibility: "auto" } as React.CSSProperties}
              >
                <div className="text-3xl md:text-4xl font-extrabold text-primary">{st.value}</div>
                <div className="text-sm text-white/70 mt-1">{st.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TRUST & COVERAGE */}
      {s.trust?.is_active && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            {s.trust?.coverage_title && (
              <h2 className="text-2xl md:text-3xl font-extrabold">{s.trust.coverage_title}</h2>
            )}
            {s.trust?.coverage_description && (
              <p className="mt-3 text-muted-foreground">{s.trust.coverage_description}</p>
            )}
            {s.trust?.coverage_items && (
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {s.trust.coverage_items.split(",").map((item) => (
                  <div key={item.trim()} className="rounded-lg border border-border bg-card p-4 text-sm">
                    {item.trim()}
                  </div>
                ))}
              </div>
            )}
            {about?.happy_customers && about?.service_locations && (
              <div className="mt-6 space-y-1">
                <div className="text-lg font-semibold text-primary">
                  {about.happy_customers} Happy Customers • {about.service_locations} Locations
                </div>
                <div className="text-sm text-muted-foreground">
                  Available for immediate quotes and emergency mini transport.
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* WHY US */}
      {whyUsSection?.items?.length > 0 && (
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
              {whyUsSection.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-balance">
              {whyUsSection.title}
            </h2>
          </div>
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            style={
              { contentVisibility: "auto", containIntrinsicSize: "0 400px" } as React.CSSProperties
            }
          >
            {whyUsSection.items.map(({ title, description }, index) => {
              const Icon = iconList[index] ?? ShieldCheck;
              return (
                <div
                  key={title}
                  className="group rounded-2xl border border-border bg-card p-7 hover:shadow-brand hover:-translate-y-1 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-brand text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
                {s.section_titles?.services_eyebrow || "Our Services"}
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-balance">
                {s.section_titles?.services_title || "End-to-end relocation services"}
              </h2>
            </div>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
              style={
                {
                  contentVisibility: "auto",
                  containIntrinsicSize: "0 800px",
                } as React.CSSProperties
              }
            >
              {services.slice(0, 8).map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <div
                    key={s.id}
                    className="rounded-2xl bg-card border border-border p-6 hover:border-primary hover:shadow-brand transition-all"
                  >
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      {s.image_url ? (
                        // use service uploaded image when available
                        <img
                          src={optimizeCloudinaryUrl(s.image_url, 44, 44)}
                          alt={s.title}
                          className="h-5 w-5 object-contain"
                        />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <h3 className="font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="brand" size="lg">
                <Link to="/services">
                  View All Services <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      {processSection?.items?.length > 0 && (
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
              {processSection?.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-balance">
              {processSection?.title}
            </h2>
          </div>
          <div
            className="grid md:grid-cols-4 gap-6 mt-12"
            style={
              { contentVisibility: "auto", containIntrinsicSize: "0 400px" } as React.CSSProperties
            }
          >
            {processSection.items.map((p) => (
              <div key={p.step} className="relative rounded-2xl bg-card border border-border p-7">
                <div className="text-5xl font-extrabold text-primary/20 absolute top-4 right-5">
                  {p.step}
                </div>
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
            <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
              {s.section_titles?.gallery_eyebrow || "Gallery"}
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-balance">
              {s.section_titles?.gallery_title || "Inside our daily operations"}
            </h2>
          </div>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12"
            style={
              { contentVisibility: "auto", containIntrinsicSize: "0 400px" } as React.CSSProperties
            }
          >
            {galleryItems.map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-2xl">
                <a
                  className="h-full w-full block"
                  onClick={(e) => {
                    e.preventDefault();
                    import("@/components/site/Lightbox").then((m) =>
                      m.openLightbox({
                        type: "image",
                        src: optimizeCloudinaryUrl(src, 1200),
                        title: `Gallery ${i + 1}`,
                      }),
                    );
                  }}
                >
                  <img
                    src={optimizeCloudinaryUrl(src, 500, 500)}
                    alt={`Gallery ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </a>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/gallery">
                View Gallery <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
                {s.section_titles?.testimonials_eyebrow || "Testimonials"}
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-balance">
                {s.section_titles?.testimonials_title || "What our customers say"}
              </h2>
            </div>
            <div
              className="grid md:grid-cols-3 gap-6 mt-12"
              style={
                {
                  contentVisibility: "auto",
                  containIntrinsicSize: "0 800px",
                } as React.CSSProperties
              }
            >
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} className="rounded-2xl bg-card border border-border p-7">
                  <div className="flex gap-1 text-primary mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground/85 leading-relaxed mb-5">"{t.message}"</p>
                  <div className="flex items-center gap-3">
                    {t.avatar_url ? (
                      <img
                        src={optimizeCloudinaryUrl(t.avatar_url, 80, 80)}
                        alt={t.name}
                        className="h-10 w-10 rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-brand text-white flex items-center justify-center font-bold">
                        {t.name[0]}
                      </div>
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
            <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
              {faqSection.eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-balance">{faqSection.title}</h2>
          </div>
          <div className="space-y-3 mt-12">
            {faqSection?.items?.map((f) => (
              <details
                key={f.question}
                className="group rounded-xl border border-border bg-card p-5 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-4 font-semibold">
                  {f.question}
                  <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center group-open:bg-primary group-open:text-primary-foreground transition-colors">
                    +
                  </span>
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
                <h2 className="text-3xl md:text-5xl font-extrabold text-white text-balance">
                  {cta.banner_text}
                </h2>
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
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base bg-transparent text-white border-white hover:bg-white hover:text-primary"
                  >
                    <a href={phoneHref}>
                      <Phone /> Call Now
                    </a>
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

export function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
        {eyebrow}
      </div>
      <h2 className="text-3xl md:text-5xl font-extrabold text-balance">{title}</h2>
    </div>
  );
}

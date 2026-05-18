import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Clock, MessageCircle, Phone, ShieldCheck, Star, Truck } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-truck.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import { useServices, useSettings, useTestimonials, useGallery } from "@/hooks/use-cms";
import { getIcon } from "@/lib/icons";

export const Route = createFileRoute("/")({ component: HomePage });

const whyUs = [
  { icon: ShieldCheck, title: "Safe & Insured", desc: "Every shipment is handled with care and fully insured for peace of mind." },
  { icon: Clock, title: "On-Time Delivery", desc: "We respect deadlines. Scheduled and delivered on time, every time." },
  { icon: Award, title: "Trained Professionals", desc: "Skilled packers and movers trained in modern handling techniques." },
  { icon: Truck, title: "Pan-India Network", desc: "Dedicated fleet covering Kakinada and all major Indian cities." },
];

const process = [
  { step: "01", title: "Get a Free Quote", desc: "Share your move details and receive a transparent estimate within hours." },
  { step: "02", title: "Survey & Plan", desc: "Our team plans packing, manpower and the right vehicle for your move." },
  { step: "03", title: "Pack & Load", desc: "Professional packing with quality materials. Safe loading by trained crew." },
  { step: "04", title: "Transport & Deliver", desc: "Careful unloading and unpacking at your new place." },
];

const faqs = [
  { q: "Do you provide service across India?", a: "Yes — we offer relocation, vehicle transport and warehousing across all major Indian cities from our Kakinada hub." },
  { q: "How are charges calculated?", a: "Charges depend on distance, volume of goods, type of service, packing material and floor access. Get a free transparent quote with no hidden fees." },
  { q: "Is my shipment insured?", a: "Yes, we offer transit insurance options to fully cover your goods during shifting." },
  { q: "How long does household shifting take?", a: "Local moves are usually completed in 1 day. Intercity moves take 2–7 days depending on distance." },
];

const fallbackGallery = [g1, g2, g3, g4];

function HomePage() {
  const { data: settings } = useSettings();
  const { data: services = [] } = useServices();
  const { data: testimonials = [] } = useTestimonials();
  const { data: gallery = [] } = useGallery();

  const hero = settings?.hero;
  const about = settings?.about;
  const contact = settings?.contact;
  const phoneHref = `tel:${(contact?.phone ?? "+919876543210").replace(/\s/g, "")}`;
  const wa = (contact?.whatsapp ?? "+919876543210").replace(/\D/g, "");

  const stats = [
    { value: about?.happy_customers ?? "5000+", label: "Happy Customers" },
    { value: about?.years_experience ?? "10+", label: "Years Experience" },
    { value: about?.cities_covered ?? "100+", label: "Cities Served" },
    { value: "24/7", label: "Support" },
  ];

  const galleryItems = gallery.length > 0
    ? gallery.slice(0, 4).map((g) => g.image_url)
    : fallbackGallery;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="SS Packers and Movers truck" className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="relative container mx-auto px-4 py-28 md:py-40 max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-medium text-white border border-white/20 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Kakinada's #1 Trusted Movers
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white text-balance leading-[1.05]">
            {hero?.title ?? "Reliable Packers & Movers in"} <span className="text-primary">Kakinada</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
            {hero?.subtitle ?? "Professional household shifting, office relocation, vehicle transportation, loading & unloading services across India."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="hero" className="h-12 px-7 text-base">
              <Link to="/enquiry">{hero?.cta ?? "Get Free Quote"} <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="brand" className="h-12 px-7 text-base">
              <a href={phoneHref}><Phone /> Call Now</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-primary">{s.value}</div>
              <div className="text-sm text-white/70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <SectionHeader eyebrow="Why Choose Us" title="Moving made simple, safe and stress-free" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {whyUs.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group rounded-2xl border border-border bg-card p-7 hover:shadow-brand hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 rounded-xl bg-gradient-brand text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section className="bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <SectionHeader eyebrow="Our Services" title="End-to-end relocation services" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
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
      <section className="container mx-auto px-4 py-20 md:py-28">
        <SectionHeader eyebrow="Our Process" title="A simple 4-step move" />
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          {process.map((p) => (
            <div key={p.step} className="relative rounded-2xl bg-card border border-border p-7">
              <div className="text-5xl font-extrabold text-primary/20 absolute top-4 right-5">{p.step}</div>
              <h3 className="font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="container mx-auto px-4 pb-20 md:pb-28">
        <SectionHeader eyebrow="Gallery" title="Inside our daily operations" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12">
          {galleryItems.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-2xl">
              <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg"><Link to="/gallery">View Gallery <ArrowRight /></Link></Button>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <SectionHeader eyebrow="Testimonials" title="What our customers say" />
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} className="rounded-2xl bg-card border border-border p-7">
                  <div className="flex gap-1 text-primary mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-foreground/85 leading-relaxed mb-5">"{t.message}"</p>
                  <div className="flex items-center gap-3">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
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
      <section className="container mx-auto px-4 py-20 md:py-28 max-w-4xl">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
        <div className="space-y-3 mt-12">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-border bg-card p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between gap-4 font-semibold">
                {f.q}
                <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center group-open:bg-primary group-open:text-primary-foreground transition-colors">+</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 md:p-16 text-center shadow-brand">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white text-balance">Planning to move? Let's make it easy.</h2>
            <p className="mt-4 text-white/90 max-w-xl mx-auto">Get a free, no-obligation quote within minutes. Our experts are ready to help.</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" variant="hero" className="h-12 px-8 text-base"><Link to="/enquiry">Get Free Quote</Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent text-white border-white hover:bg-white hover:text-primary"><a href={phoneHref}><Phone /> Call Now</a></Button>
            </div>
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

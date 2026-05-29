import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { Button } from "@/components/ui/button";
import { useSettings, settingsQueryOptions } from "@/hooks/use-cms";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SS Packers & Movers Kakinada" },
      { name: "description", content: "Reach SS Packers & Movers in Kakinada — phone, WhatsApp, email and address." },
    ],
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(settingsQueryOptions());
    } catch (error) {
      console.error("Error prefetching data for contact route:", error);
    }
  },
  component: ContactPage,
});

function ContactPage() {
  const { data: s } = useSettings();
  const c = s?.contact;
  const phone = c?.phone;
  const heroImage = s?.hero_images?.contact;
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "#";
  const wa = c?.whatsapp ? c.whatsapp.replace(/\D/g, "") : "";
  const email = c?.email;
  const address = c?.address;

  const infoCards: { icon: typeof Phone; title: string; value: string; href?: string }[] = [
    ...(address ? [{ icon: MapPin, title: "Office Address", value: address }] : []),
    ...(phone ? [{ icon: Phone, title: "Phone", value: phone, href: phoneHref }] : []),
    ...(email ? [{ icon: Mail, title: "Email", value: email, href: `mailto:${email}` }] : []),
    ...(c?.gstin ? [{ icon: MapPin, title: "GSTIN", value: c.gstin }] : []),
  ];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact Us"
        title="Let's talk about your move"
        subtitle="We respond to most enquiries within an hour."
        backgroundImage={heroImage}
      />
      {/* CONTACT INFO CARDS */}
      {infoCards.length > 0 && (
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {infoCards.map(({ icon: Icon, title, value, href }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 md:p-7 flex gap-4 items-start hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-gradient-brand text-white flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">{title}</div>
                  {href ? (
                    <a href={href} className="font-semibold text-base hover:text-primary break-all transition-colors">{value}</a>
                  ) : (
                    <div className="font-semibold text-base break-all">{value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GET IN TOUCH */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold">Get in touch</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Call us, send a WhatsApp message, or fill out our quick enquiry form. We are ready to help.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {phone && (
                <Button asChild variant="brand" size="lg" className="h-13 px-7 text-base">
                  <a href={phoneHref}><Phone className="h-5 w-5" /> Call {phone}</a>
                </Button>
              )}
              {wa && (
                <Button asChild variant="outline" size="lg" className="h-13 px-7 text-base">
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-5 w-5" /> WhatsApp
                  </a>
                </Button>
              )}
              <Button asChild size="lg" className="h-13 px-7 text-base">
                <Link to="/enquiry" search={{ service: undefined }}>
                  Enquiry Form <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* GOOGLE MAP */}
      {address && (
        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
              <div className="aspect-[21/9] md:aspect-[21/8]">
                <iframe
                  title="Office location map"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* QUICK REACH OUT */}
      <section className="bg-gradient-brand py-16 md:py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold text-balance">Ready to move? We are here to help.</h2>
          <p className="mt-4 text-white/90 max-w-xl mx-auto">
            Get a free, no-obligation quote for your move. Our team typically responds within 30 minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="hero" className="h-12 px-8 text-base">
              <Link to="/enquiry" search={{ service: undefined }}>Get Free Quote <ArrowRight /></Link>
            </Button>
            {phone && (
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent text-white border-white hover:bg-white hover:text-primary">
                <a href={phoneHref}><Phone /> Call Now</a>
              </Button>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

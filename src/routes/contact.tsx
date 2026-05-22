import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
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
  const { data: s, isLoading } = useSettings();
  const c = s?.contact;
  const phone = c?.phone;
  const heroImage = s?.hero_images?.contact;
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "#";
  const wa = c?.whatsapp ? c.whatsapp.replace(/\D/g, "") : "";
  const email = c?.email;
  const address = c?.address;

  const items: { icon: typeof Phone; title: string; value: string; href?: string }[] = [
    ...(address ? [{ icon: MapPin, title: "Office", value: address }] : []),
    ...(phone ? [{ icon: Phone, title: "Phone", value: phone, href: phoneHref }] : []),
    ...(email ? [{ icon: Mail, title: "Email", value: email, href: `mailto:${email}` }] : []),
  ];

  if (isLoading) {
    return (
      <SiteLayout>
        <section className="relative overflow-hidden">
          <div className="h-[50vh] min-h-[360px] w-full bg-muted" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </section>
        <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
          <p className="text-center text-muted-foreground col-span-full">Loading contact details…</p>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your move"
        subtitle="We respond to most enquiries within an hour."
        backgroundImage={heroImage}
      />
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
        {items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(({ icon: Icon, title, value, href }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-7 flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-brand text-white flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{title}</div>
                  {href ? <a href={href} className="font-semibold text-lg hover:text-primary break-all">{value}</a> : <div className="font-semibold text-lg">{value}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {address && (
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl overflow-hidden border border-border aspect-[16/7]">
          <iframe
            title="Office map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </section>
      )}
      {(phone || wa) && (
      <section className="container mx-auto px-4 pb-16 text-center">
        <div className="flex flex-wrap justify-center gap-3">
          {phone && <Button asChild variant="brand" size="lg"><a href={phoneHref}><Phone /> Call Now</a></Button>}
          {wa && <Button asChild variant="outline" size="lg"><a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button>}
        </div>
      </section>
      )}
    </SiteLayout>
  );
}

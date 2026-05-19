import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-cms";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SS Packers & Movers Kakinada" },
      { name: "description", content: "Reach SS Packers & Movers in Kakinada — phone, WhatsApp, email and address." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: s } = useSettings();
  const c = s?.contact;
  const phone = c?.phone ?? "+91 98765 43210";
  const heroImage = s?.hero_images?.contact;
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
  const wa = (c?.whatsapp ?? "+919876543210").replace(/\D/g, "");
  const email = c?.email ?? "info@sspackersmovers.in";
  const address = c?.address ?? "Kakinada, Andhra Pradesh, India";

  const items: { icon: typeof Phone; title: string; value: string; href?: string }[] = [
    { icon: MapPin, title: "Office", value: address },
    { icon: Phone, title: "Phone", value: phone, href: phoneHref },
    { icon: Mail, title: "Email", value: email, href: `mailto:${email}` },
    { icon: Clock, title: "Hours", value: "Mon – Sun, 8:00 AM – 9:00 PM" },
  ];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your move"
        subtitle="We respond to most enquiries within an hour."
        backgroundImage={heroImage}
      />
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
        {items.map(({ icon: Icon, title, value, href }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-7 flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-brand text-white flex items-center justify-center shrink-0"><Icon className="h-5 w-5" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{title}</div>
              {href ? <a href={href} className="font-semibold text-lg hover:text-primary break-all">{value}</a> : <div className="font-semibold text-lg">{value}</div>}
            </div>
          </div>
        ))}
      </section>
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl overflow-hidden border border-border aspect-[16/7]">
          <iframe
            title="Office map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
        <div className="text-center mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand" size="lg"><a href={phoneHref}><Phone /> Call Now</a></Button>
          <Button asChild variant="outline" size="lg"><a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button>
        </div>
      </section>
    </SiteLayout>
  );
}

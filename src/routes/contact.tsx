import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SS Packers & Movers Kakinada" },
      { name: "description", content: "Reach SS Packers & Movers in Kakinada — phone, WhatsApp, email and address." },
    ],
  }),
  component: ContactPage,
});

const items = [
  { icon: MapPin, title: "Office", value: "Main Road, Kakinada, Andhra Pradesh 533001, India" },
  { icon: Phone, title: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: Mail, title: "Email", value: "info@sspackersmovers.in", href: "mailto:info@sspackersmovers.in" },
  { icon: Clock, title: "Hours", value: "Mon – Sun, 8:00 AM – 9:00 PM" },
];

function ContactPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Contact" title="Let's talk about your move" subtitle="We respond to most enquiries within an hour." />
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
        {items.map(({ icon: Icon, title, value, href }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-7 flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-brand text-white flex items-center justify-center shrink-0"><Icon className="h-5 w-5" /></div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">{title}</div>
              {href ? <a href={href} className="font-semibold text-lg hover:text-primary">{value}</a> : <div className="font-semibold text-lg">{value}</div>}
            </div>
          </div>
        ))}
      </section>
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl overflow-hidden border border-border aspect-[16/7]">
          <iframe
            title="Kakinada map"
            src="https://www.google.com/maps?q=Kakinada,+Andhra+Pradesh&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
        <div className="text-center mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand" size="lg"><a href="tel:+919876543210"><Phone /> Call Now</a></Button>
          <Button asChild variant="outline" size="lg"><a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></Button>
        </div>
      </section>
    </SiteLayout>
  );
}

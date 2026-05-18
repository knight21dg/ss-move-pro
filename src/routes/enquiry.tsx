import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { MessageCircle, Send } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHero } from "./about";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/data/services";

export const Route = createFileRoute("/enquiry")({
  head: () => ({
    meta: [
      { title: "Get a Free Quote — SS Packers & Movers Kakinada" },
      { name: "description", content: "Tell us about your move and get a free, no-obligation quote from SS Packers & Movers." },
    ],
  }),
  component: EnquiryPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone: z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  pickup: z.string().trim().min(2, "Enter pickup location").max(200),
  drop: z.string().trim().min(2, "Enter drop location").max(200),
  service: z.string().trim().min(1, "Select a service"),
  date: z.string().trim().min(1, "Pick a date"),
  message: z.string().trim().max(1000).optional(),
});

function EnquiryPage() {
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Enquiry sent! Our team will reach out within hours.");
    }, 700);
  }

  function whatsappQuote() {
    const fd = new FormData(document.getElementById("enquiry-form") as HTMLFormElement);
    const d = Object.fromEntries(fd.entries()) as Record<string, string>;
    const text = encodeURIComponent(
      `Hi SS Packers & Movers,\n\nName: ${d.name || ""}\nPhone: ${d.phone || ""}\nFrom: ${d.pickup || ""}\nTo: ${d.drop || ""}\nService: ${d.service || ""}\nDate: ${d.date || ""}\n\n${d.message || ""}`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, "_blank");
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Enquiry" title="Get a free quote" subtitle="Fill in your details and we'll get back with a transparent estimate." />
      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <form id="enquiry-form" onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-5 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">
            <Field name="name" label="Full Name" placeholder="John Doe" />
            <Field name="phone" label="Phone" placeholder="+91 98765 43210" type="tel" />
            <Field name="email" label="Email" placeholder="you@email.com" type="email" className="sm:col-span-2" />
            <Field name="pickup" label="Pickup Location" placeholder="Kakinada" />
            <Field name="drop" label="Drop Location" placeholder="Hyderabad" />
            <div>
              <Label htmlFor="service">Service Type</Label>
              <select id="service" name="service" required className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Select a service</option>
                {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
              </select>
            </div>
            <Field name="date" label="Moving Date" type="date" />
            <div className="sm:col-span-2">
              <Label htmlFor="message">Additional Details</Label>
              <Textarea id="message" name="message" rows={4} placeholder="Tell us about your items, floor, parking, etc." className="mt-1.5" />
            </div>
            <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
              <Button type="submit" variant="brand" size="lg" disabled={submitting}>
                <Send /> {submitting ? "Sending..." : "Submit Enquiry"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={whatsappQuote}>
                <MessageCircle /> Send via WhatsApp
              </Button>
            </div>
          </form>
        </div>
        <aside className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl bg-gradient-dark text-white p-7">
            <h3 className="font-bold text-xl mb-3">Why request a quote?</h3>
            <ul className="space-y-3 text-sm text-white/85">
              {[
                "Transparent estimate — no hidden charges",
                "Custom plan based on your move size",
                "Free survey for large relocations",
                "Quick response within working hours",
              ].map((t) => <li key={t} className="flex gap-2"><span className="text-primary">●</span> {t}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-brand text-white p-7 shadow-brand">
            <h3 className="font-bold text-xl">Need help right now?</h3>
            <p className="text-sm text-white/90 mt-2">Talk to our team directly.</p>
            <a href="tel:+919876543210" className="block mt-4 text-2xl font-extrabold">+91 98765 43210</a>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({ name, label, className, ...rest }: { name: string; label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} required className="mt-1.5" {...rest} />
    </div>
  );
}

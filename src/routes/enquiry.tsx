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
import { supabase } from "@/integrations/supabase/client";
import { useServices, useSettings } from "@/hooks/use-cms";

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
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  from_city: z.string().trim().min(2, "Enter pickup location").max(200),
  to_city: z.string().trim().min(2, "Enter drop location").max(200),
  service: z.string().trim().min(1, "Select a service"),
  moving_date: z.string().trim().min(1, "Pick a date"),
  message: z.string().trim().max(1000).optional(),
});

function EnquiryPage() {
  const [submitting, setSubmitting] = useState(false);
  const { data: services = [] } = useServices();
  const { data: settings } = useSettings();
  const wa = (settings?.contact.whatsapp ?? "+919876543210").replace(/\D/g, "");
  const phone = settings?.contact.phone ?? "+91 98765 43210";
  const waTpl = settings?.contact.whatsapp_enquiry_message ?? "Hi, I’m interested in your services. Can I get a quote?";
  const heroImage = settings?.hero_images?.enquiry;

  function fillWa(msg: string, vars: Record<string, string>) {
    let t = msg;
    for (const [k, v] of Object.entries(vars)) t = t.replace(new RegExp(`\\{${k}\\}`, "g"), v);
    return encodeURIComponent(t);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      from_city: parsed.data.from_city,
      to_city: parsed.data.to_city,
      service: parsed.data.service,
      moving_date: parsed.data.moving_date,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    // auto-open WhatsApp to business with pre-filled enquiry
    const vars = {
      name: parsed.data.name,
      phone: parsed.data.phone,
      from_city: parsed.data.from_city,
      to_city: parsed.data.to_city,
      service: parsed.data.service,
      moving_date: parsed.data.moving_date,
      message: parsed.data.message || "",
    };
    window.open(`https://wa.me/${wa}?text=${fillWa(waTpl, vars)}`, "_blank");
    form.reset();
    toast.success("Enquiry sent! WhatsApp should open for a direct chat with our team.");
  }

  function whatsappQuote() {
    const fd = new FormData(document.getElementById("enquiry-form") as HTMLFormElement);
    const d = Object.fromEntries(fd.entries()) as Record<string, string>;
    const text = encodeURIComponent(
      `Hi SS Packers & Movers,\n\nName: ${d.name || ""}\nPhone: ${d.phone || ""}\nFrom: ${d.from_city || ""}\nTo: ${d.to_city || ""}\nService: ${d.service || ""}\nDate: ${d.moving_date || ""}\n\n${d.message || ""}`
    );
    window.open(`https://wa.me/${wa}?text=${text}`, "_blank");
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Enquiry"
        title="Get a free quote"
        subtitle="Fill in your details and we'll get back with a transparent estimate."
        backgroundImage={heroImage}
      />
      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <form id="enquiry-form" onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-5 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">
            <Field name="name" label="Full Name" placeholder="John Doe" />
            <Field name="phone" label="Phone" placeholder="+91 98765 43210" type="tel" />
            <Field name="email" label="Email" placeholder="you@email.com" type="email" required={false} className="sm:col-span-2" />
            <Field name="from_city" label="Pickup Location" placeholder="Kakinada" />
            <Field name="to_city" label="Drop Location" placeholder="Hyderabad" />
            <div>
              <Label htmlFor="service">Service Type</Label>
              <select id="service" name="service" required className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Select a service</option>
                {services.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
              </select>
            </div>
            <Field name="moving_date" label="Moving Date" type="date" />
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
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="block mt-4 text-2xl font-extrabold">{phone}</a>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({ name, label, className, required = true, ...rest }: { name: string; label: string; className?: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} required={required} className="mt-1.5" {...rest} />
    </div>
  );
}

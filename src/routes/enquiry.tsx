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
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useServices, useSettings, servicesQueryOptions, settingsQueryOptions } from "@/hooks/use-cms";

export const Route = createFileRoute("/enquiry")({
  head: () => ({
    meta: [
      { title: "Get a Free Quote — SS Packers & Movers Kakinada" },
      { name: "description", content: "Tell us about your move and get a free, no-obligation quote from SS Packers & Movers." },
    ],
  }),
  loader: async ({ context }) => {
    try {
      await Promise.all([
        context.queryClient.ensureQueryData(settingsQueryOptions()),
        context.queryClient.ensureQueryData(servicesQueryOptions(true)),
      ]);
    } catch (error) {
      console.error("Error prefetching data for enquiry route:", error);
    }
  },
  component: EnquiryPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[0-9]{10}$/),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  from_city: z.string().trim().min(2).max(200),
  to_city: z.string().trim().min(2).max(200),
  service: z.string().trim().min(1),
  moving_date: z.string().trim().min(1),
  message: z.string().trim().max(1000).optional(),
});

function EnquiryPage() {
  const [submitting, setSubmitting] = useState(false);
  const { data: services = [] } = useServices();
  const { data: settings } = useSettings();
  const wa = settings?.contact?.whatsapp ? settings.contact.whatsapp.replace(/\D/g, "") : "";
  const phone = settings?.contact?.phone;
  const waTpl = settings?.contact?.whatsapp_enquiry_message ?? "";
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
    try {
      await addDoc(collection(db, "enquiries"), {
        name: parsed.data.name,
        phone: "+91" + parsed.data.phone,
        email: parsed.data.email || null,
        from_city: parsed.data.from_city,
        to_city: parsed.data.to_city,
        service: parsed.data.service,
        moving_date: parsed.data.moving_date,
        message: parsed.data.message || null,
        status: "new",
        admin_notes: null,
        created_at: new Date().toISOString(),
      });
      if (!wa) {
        toast.success("Enquiry sent!");
        form.reset();
        setSubmitting(false);
        return;
      }
      const vars = {
        name: parsed.data.name,
        phone: "+91" + parsed.data.phone,
        from_city: parsed.data.from_city,
        to_city: parsed.data.to_city,
        service: parsed.data.service,
        moving_date: parsed.data.moving_date,
        message: parsed.data.message || "",
      };
      window.open(`https://wa.me/${wa}?text=${fillWa(waTpl, vars)}`, "_blank");
      form.reset();
      toast.success("Enquiry sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send enquiry");
    } finally {
      setSubmitting(false);
    }
  }

  function whatsappQuote() {
    const d = Object.fromEntries(new FormData(document.getElementById("enquiry-form") as HTMLFormElement).entries()) as Record<string, string>;
    const phoneNum = d.phone ? "+91" + d.phone.replace(/\D/g, "") : "";
    const text = encodeURIComponent(
      `Hi SS Packers & Movers,\n\nName: ${d.name || ""}\nPhone: ${phoneNum}\nFrom: ${d.from_city || ""}\nTo: ${d.to_city || ""}\nService: ${d.service || ""}\nDate: ${d.moving_date || ""}\n\n${d.message || ""}`,
    );
    if (!wa) return;
    window.open(`https://wa.me/${wa}?text=${text}`, "_blank");
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Enquiry" title="Get a free quote" subtitle="Fill in your details and we'll get back with a transparent estimate." backgroundImage={heroImage} />
      <section className="container mx-auto px-4 py-16 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <form id="enquiry-form" onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-5 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">
            <Field name="name" label="Full Name" />
            <Field name="phone" label="Phone" type="tel" prefix="+91" />
            <Field name="email" label="Email" type="email" required={false} className="sm:col-span-2" />
            <Field name="from_city" label="Pickup Location" />
            <Field name="to_city" label="Drop Location" />
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
              <Textarea id="message" name="message" rows={4} className="mt-1.5" />
            </div>
            <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
              <Button type="submit" variant="brand" size="lg" disabled={submitting}><Send /> {submitting ? "Sending..." : "Submit Enquiry"}</Button>
              <Button type="button" variant="outline" size="lg" onClick={whatsappQuote}><MessageCircle /> Send via WhatsApp</Button>
            </div>
          </form>
        </div>
        <aside className="lg:col-span-2">
          <div className="rounded-2xl bg-card border border-border text-card-foreground p-7">
            <h3 className="font-bold text-xl mb-3">Enquiry</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">Submit the form and we'll get back with a transparent estimate.</p>
            {phone && <p className="text-sm text-muted-foreground">Or call us directly at <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold text-primary hover:underline">{phone}</a></p>}
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Field({ name, label, className, required = true, prefix, ...rest }: { name: string; label: string; className?: string; required?: boolean; prefix?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = name;
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      {prefix ? (
        <div className="flex mt-1.5">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">{prefix}</span>
          <Input id={id} name={name} required={required} className="rounded-l-none" {...rest} />
        </div>
      ) : <Input id={id} name={name} required={required} className="mt-1.5" {...rest} />}
    </div>
  );
}

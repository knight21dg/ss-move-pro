import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useSettings, DEFAULT_SETTINGS, type SiteSettings } from "@/hooks/use-cms";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  const { data: s, isLoading } = useSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => { if (s) setForm(s); }, [s]);

  const updateWhyUsItem = (index: number, patch: Partial<SiteSettings["home_why_us"]["items"][number]>) => {
    setForm((prev) => ({
      ...prev,
      home_why_us: {
        ...prev.home_why_us,
        items: prev.home_why_us.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }));
  };

  const addWhyUsItem = () => {
    setForm((prev) => ({
      ...prev,
      home_why_us: {
        ...prev.home_why_us,
        items: [...prev.home_why_us.items, { title: "", desc: "" }],
      },
    }));
  };

  const removeWhyUsItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      home_why_us: {
        ...prev.home_why_us,
        items: prev.home_why_us.items.filter((_, i) => i !== index),
      },
    }));
  };

  const updateProcessItem = (index: number, patch: Partial<SiteSettings["home_process"]["items"][number]>) => {
    setForm((prev) => ({
      ...prev,
      home_process: {
        ...prev.home_process,
        items: prev.home_process.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }));
  };

  const addProcessItem = () => {
    setForm((prev) => ({
      ...prev,
      home_process: {
        ...prev.home_process,
        items: [...prev.home_process.items, { step: "", title: "", desc: "" }],
      },
    }));
  };

  const removeProcessItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      home_process: {
        ...prev.home_process,
        items: prev.home_process.items.filter((_, i) => i !== index),
      },
    }));
  };

  const updateFaqItem = (index: number, patch: Partial<SiteSettings["home_faqs"]["items"][number]>) => {
    setForm((prev) => ({
      ...prev,
      home_faqs: {
        ...prev.home_faqs,
        items: prev.home_faqs.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }));
  };

  const addFaqItem = () => {
    setForm((prev) => ({
      ...prev,
      home_faqs: {
        ...prev.home_faqs,
        items: [...prev.home_faqs.items, { question: "", answer: "" }],
      },
    }));
  };

  const removeFaqItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      home_faqs: {
        ...prev.home_faqs,
        items: prev.home_faqs.items.filter((_, i) => i !== index),
      },
    }));
  };

  const updateSeo = (
    scope: "default" | keyof SiteSettings["seo"]["pages"],
    field: keyof SiteSettings["seo"]["default"],
    value: string
  ) => {
    setForm((prev) => {
      if (scope === "default") {
        return {
          ...prev,
          seo: {
            ...prev.seo,
            default: { ...prev.seo.default, [field]: value },
          },
        };
      }
      return {
        ...prev,
        seo: {
          ...prev.seo,
          pages: {
            ...prev.seo.pages,
            [scope]: { ...prev.seo.pages[scope], [field]: value },
          },
        },
      };
    });
  };

  const save = useMutation({
    mutationFn: async () => {
      const rows = Object.entries(form).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["site_settings"] }); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <AdminLayout title="Site Settings"><p className="text-muted-foreground">Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="Site Settings">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Title</Label><Input value={form.hero.title} onChange={(e) => setForm({ ...form, hero: { ...form.hero, title: e.target.value } })} /></div>
            <div><Label>Subtitle</Label><Input value={form.hero.subtitle} onChange={(e) => setForm({ ...form, hero: { ...form.hero, subtitle: e.target.value } })} /></div>
            <div><Label>CTA Button Text</Label><Input value={form.hero.cta} onChange={(e) => setForm({ ...form, hero: { ...form.hero, cta: e.target.value } })} /></div>
            <div><Label>Home Hero Background Image URL</Label><Input value={form.hero_images.home} onChange={(e) => setForm({ ...form, hero_images: { ...form.hero_images, home: e.target.value } })} placeholder="https://..." /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Page Hero Background Images</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>About Page</Label><Input value={form.hero_images.about} onChange={(e) => setForm({ ...form, hero_images: { ...form.hero_images, about: e.target.value } })} placeholder="https://..." /></div>
              <div><Label>Services Page</Label><Input value={form.hero_images.services} onChange={(e) => setForm({ ...form, hero_images: { ...form.hero_images, services: e.target.value } })} placeholder="https://..." /></div>
              <div><Label>Gallery Page</Label><Input value={form.hero_images.gallery} onChange={(e) => setForm({ ...form, hero_images: { ...form.hero_images, gallery: e.target.value } })} placeholder="https://..." /></div>
              <div><Label>Videos Page</Label><Input value={form.hero_images.videos} onChange={(e) => setForm({ ...form, hero_images: { ...form.hero_images, videos: e.target.value } })} placeholder="https://..." /></div>
              <div><Label>Enquiry Page</Label><Input value={form.hero_images.enquiry} onChange={(e) => setForm({ ...form, hero_images: { ...form.hero_images, enquiry: e.target.value } })} placeholder="https://..." /></div>
              <div><Label>Contact Page</Label><Input value={form.hero_images.contact} onChange={(e) => setForm({ ...form, hero_images: { ...form.hero_images, contact: e.target.value } })} placeholder="https://..." /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Why Choose Us (Home Page)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Eyebrow</Label><Input value={form.home_why_us.eyebrow} onChange={(e) => setForm({ ...form, home_why_us: { ...form.home_why_us, eyebrow: e.target.value } })} /></div>
            <div><Label>Title</Label><Input value={form.home_why_us.title} onChange={(e) => setForm({ ...form, home_why_us: { ...form.home_why_us, title: e.target.value } })} /></div>
            <div className="space-y-3">
              {form.home_why_us.items.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Item {index + 1}</Label>
                    <Button variant="ghost" size="sm" onClick={() => removeWhyUsItem(index)} disabled={form.home_why_us.items.length <= 1}>
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                  <div><Label>Title</Label><Input value={item.title} onChange={(e) => updateWhyUsItem(index, { title: e.target.value })} /></div>
                  <div><Label>Description</Label><Textarea rows={2} value={item.desc} onChange={(e) => updateWhyUsItem(index, { desc: e.target.value })} /></div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addWhyUsItem}><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Our Process (Home Page)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Eyebrow</Label><Input value={form.home_process.eyebrow} onChange={(e) => setForm({ ...form, home_process: { ...form.home_process, eyebrow: e.target.value } })} /></div>
            <div><Label>Title</Label><Input value={form.home_process.title} onChange={(e) => setForm({ ...form, home_process: { ...form.home_process, title: e.target.value } })} /></div>
            <div className="space-y-3">
              {form.home_process.items.map((item, index) => (
                <div key={`${item.step}-${index}`} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Step {index + 1}</Label>
                    <Button variant="ghost" size="sm" onClick={() => removeProcessItem(index)} disabled={form.home_process.items.length <= 1}>
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div><Label>Number</Label><Input value={item.step} onChange={(e) => updateProcessItem(index, { step: e.target.value })} /></div>
                    <div className="sm:col-span-2"><Label>Title</Label><Input value={item.title} onChange={(e) => updateProcessItem(index, { title: e.target.value })} /></div>
                  </div>
                  <div><Label>Description</Label><Textarea rows={2} value={item.desc} onChange={(e) => updateProcessItem(index, { desc: e.target.value })} /></div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addProcessItem}><Plus className="h-4 w-4 mr-2" /> Add Step</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>FAQ (Home Page)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Eyebrow</Label><Input value={form.home_faqs.eyebrow} onChange={(e) => setForm({ ...form, home_faqs: { ...form.home_faqs, eyebrow: e.target.value } })} /></div>
            <div><Label>Title</Label><Input value={form.home_faqs.title} onChange={(e) => setForm({ ...form, home_faqs: { ...form.home_faqs, title: e.target.value } })} /></div>
            <div className="space-y-3">
              {form.home_faqs.items.map((item, index) => (
                <div key={`${item.question}-${index}`} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Question {index + 1}</Label>
                    <Button variant="ghost" size="sm" onClick={() => removeFaqItem(index)} disabled={form.home_faqs.items.length <= 1}>
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                  <div><Label>Question</Label><Input value={item.question} onChange={(e) => updateFaqItem(index, { question: e.target.value })} /></div>
                  <div><Label>Answer</Label><Textarea rows={3} value={item.answer} onChange={(e) => updateFaqItem(index, { answer: e.target.value })} /></div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addFaqItem}><Plus className="h-4 w-4 mr-2" /> Add FAQ</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>About Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Heading</Label><Input value={form.about.heading} onChange={(e) => setForm({ ...form, about: { ...form.about, heading: e.target.value } })} /></div>
            <div><Label>Body</Label><Textarea rows={5} value={form.about.body} onChange={(e) => setForm({ ...form, about: { ...form.about, body: e.target.value } })} /></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><Label>Years Experience</Label><Input value={form.about.years_experience} onChange={(e) => setForm({ ...form, about: { ...form.about, years_experience: e.target.value } })} /></div>
              <div><Label>Happy Customers</Label><Input value={form.about.happy_customers} onChange={(e) => setForm({ ...form, about: { ...form.about, happy_customers: e.target.value } })} /></div>
              <div><Label>Cities Covered</Label><Input value={form.about.cities_covered} onChange={(e) => setForm({ ...form, about: { ...form.about, cities_covered: e.target.value } })} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Phone</Label><Input value={form.contact.phone} onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} /></div>
              <div><Label>WhatsApp</Label><Input value={form.contact.whatsapp} onChange={(e) => setForm({ ...form, contact: { ...form.contact, whatsapp: e.target.value } })} /></div>
            </div>
            <div><Label>Email</Label><Input value={form.contact.email} onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })} /></div>
            <div><Label>Address</Label><Textarea rows={2} value={form.contact.address} onChange={(e) => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })} /></div>
            <div>
              <Label>WhatsApp Enquiry Message Template</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">Use {'{name}'}, {'{phone}'}, {'{from_city}'}, {'{to_city}'}, {'{service}'}, {'{moving_date}'}, {'{message}'} as placeholders.</p>
              <Textarea rows={3} value={form.contact.whatsapp_enquiry_message} onChange={(e) => setForm({ ...form, contact: { ...form.contact, whatsapp_enquiry_message: e.target.value } })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Facebook URL</Label><Input value={form.social.facebook} onChange={(e) => setForm({ ...form, social: { ...form.social, facebook: e.target.value } })} /></div>
            <div><Label>Instagram URL</Label><Input value={form.social.instagram} onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })} /></div>
            <div><Label>YouTube URL</Label><Input value={form.social.youtube} onChange={(e) => setForm({ ...form, social: { ...form.social, youtube: e.target.value } })} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="text-sm font-semibold">Default SEO</div>
              <div><Label>Title</Label><Input value={form.seo.default.title} onChange={(e) => updateSeo("default", "title", e.target.value)} /></div>
              <div><Label>Description</Label><Textarea rows={2} value={form.seo.default.description} onChange={(e) => updateSeo("default", "description", e.target.value)} /></div>
              <div><Label>Keywords</Label><Textarea rows={2} value={form.seo.default.keywords} onChange={(e) => updateSeo("default", "keywords", e.target.value)} /></div>
              <div><Label>OG Image URL</Label><Input value={form.seo.default.og_image} onChange={(e) => updateSeo("default", "og_image", e.target.value)} placeholder="https://..." /></div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-semibold">Per-Page SEO</div>
              {([
                ["home", "Home"],
                ["about", "About"],
                ["services", "Services"],
                ["gallery", "Gallery"],
                ["videos", "Videos"],
                ["enquiry", "Enquiry"],
                ["contact", "Contact"],
              ] as const).map(([key, label]) => (
                <div key={key} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="text-sm font-semibold">{label}</div>
                  <div><Label>Title</Label><Input value={form.seo.pages[key].title} onChange={(e) => updateSeo(key, "title", e.target.value)} /></div>
                  <div><Label>Description</Label><Textarea rows={2} value={form.seo.pages[key].description} onChange={(e) => updateSeo(key, "description", e.target.value)} /></div>
                  <div><Label>Keywords</Label><Textarea rows={2} value={form.seo.pages[key].keywords} onChange={(e) => updateSeo(key, "keywords", e.target.value)} /></div>
                  <div><Label>OG Image URL</Label><Input value={form.seo.pages[key].og_image} onChange={(e) => updateSeo(key, "og_image", e.target.value)} placeholder="https://..." /></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-4 bg-background border border-border rounded-xl p-3 flex justify-end shadow-lg">
          <Button variant="brand" size="lg" onClick={() => save.mutate()} disabled={save.isPending}>
            <Save className="h-4 w-4 mr-2" /> {save.isPending ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

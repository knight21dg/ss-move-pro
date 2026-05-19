import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
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

        <div className="sticky bottom-4 bg-background border border-border rounded-xl p-3 flex justify-end shadow-lg">
          <Button variant="brand" size="lg" onClick={() => save.mutate()} disabled={save.isPending}>
            <Save className="h-4 w-4 mr-2" /> {save.isPending ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

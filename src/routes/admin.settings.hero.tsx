import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsForm } from "@/hooks/use-settings-form";

export const Route = createFileRoute("/admin/settings/hero")({ component: HeroSettings });

function HeroSettings() {
  const { form, setForm, isLoading, save } = useSettingsForm();

  if (isLoading) return <AdminLayout title="Hero Settings"><p className="text-muted-foreground">Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="Hero Settings">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Home Hero Text</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Title</Label><Input value={form.hero.title} onChange={(e) => setForm({ ...form, hero: { ...form.hero, title: e.target.value } })} /></div>
            <div><Label>Subtitle</Label><Input value={form.hero.subtitle} onChange={(e) => setForm({ ...form, hero: { ...form.hero, subtitle: e.target.value } })} /></div>
            <div><Label>CTA Button Text</Label><Input value={form.hero.cta} onChange={(e) => setForm({ ...form, hero: { ...form.hero, cta: e.target.value } })} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Hero Background Images</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Home Page</Label><Input value={form.hero_images.home} onChange={(e) => setForm({ ...form, hero_images: { ...form.hero_images, home: e.target.value } })} placeholder="https://..." /></div>
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

        <div className="sticky bottom-4 bg-background border border-border rounded-xl p-3 flex justify-end shadow-lg">
          <Button variant="brand" size="lg" onClick={() => save.mutate()} disabled={save.isPending}>
            <Save className="h-4 w-4 mr-2" /> {save.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsForm } from "@/hooks/use-settings-form";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/settings/hero")({ component: HeroSettings });

const HERO_IMAGE_KEYS = ["home", "about", "services", "gallery", "videos", "enquiry", "contact"] as const;

function HeroSettings() {
  const { form, setForm, isLoading, save } = useSettingsForm();

  if (isLoading) return <AdminLayout title="Hero Settings"><p className="text-muted-foreground">Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="Hero Settings">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Home Hero Text</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Badge</Label><Input value={form.hero.badge as string | undefined} onChange={(e) => setForm({ ...form, hero: { ...form.hero, badge: e.target.value } })} /></div>
            <div><Label>Title</Label><Input value={form.hero.title as string | undefined} onChange={(e) => setForm({ ...form, hero: { ...form.hero, title: e.target.value } })} /></div>
            <div><Label>Subtitle</Label><Input value={form.hero.subtitle as string | undefined} onChange={(e) => setForm({ ...form, hero: { ...form.hero, subtitle: e.target.value } })} /></div>
            <div><Label>CTA Button Text</Label><Input value={form.hero.cta as string | undefined} onChange={(e) => setForm({ ...form, hero: { ...form.hero, cta: e.target.value } })} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Hero Background Images</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {HERO_IMAGE_KEYS.map((key) => (
              <div key={key}>
                <Label>{key.charAt(0).toUpperCase() + key.slice(1)} Page</Label>
                <ImageUpload
                  value={form.hero_images[key] as string | undefined}
                  onChange={(url) => setForm({ ...form, hero_images: { ...form.hero_images, [key]: url } })}
                />
              </div>
            ))}
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

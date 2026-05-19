import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsForm } from "@/hooks/use-settings-form";

export const Route = createFileRoute("/admin/settings/about")({ component: AboutSettings });

function AboutSettings() {
  const { form, setForm, isLoading, save } = useSettingsForm();

  if (isLoading) return <AdminLayout title="About Settings"><p className="text-muted-foreground">Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="About Settings">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>About Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Heading</Label><Textarea rows={3} value={form.about.heading} onChange={(e) => setForm((prev) => ({ ...prev, about: { ...prev.about, heading: e.target.value } }))} /></div>
            <div><Label>Body</Label><Textarea rows={5} value={form.about.body} onChange={(e) => setForm((prev) => ({ ...prev, about: { ...prev.about, body: e.target.value } }))} /></div>
            <div className="grid sm:grid-cols-3 gap-4">
              {(["years_experience", "happy_customers", "cities_covered"] as const).map((k) => (
                <div key={k}><Label>{k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</Label>
                  <Input value={form.about[k]} onChange={(e) => setForm((prev) => ({ ...prev, about: { ...prev.about, [k]: e.target.value } }))} />
                </div>
              ))}
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

import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsForm } from "@/hooks/use-settings-form";

export const Route = createFileRoute("/admin/settings/footer")({ component: FooterSettings });

function FooterSettings() {
  const { form, setForm, isLoading, save } = useSettingsForm();

  if (isLoading)
    return (
      <AdminLayout title="Footer Settings">
        <p className="text-muted-foreground">Loading...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout title="Footer Settings">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Footer Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Description (shown below logo in footer)</Label>
              <Textarea
                rows={3}
                value={form.footer.description}
                onChange={(e) => setForm({ ...form, footer: { ...form.footer, description: e.target.value } })}
              />
            </div>
            <div>
              <Label>Quick Links (one per line, format: label:path)</Label>
              <Textarea
                rows={4}
                value={form.footer.quick_links}
                onChange={(e) => setForm({ ...form, footer: { ...form.footer, quick_links: e.target.value } })}
              />
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
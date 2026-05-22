import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsForm } from "@/hooks/use-settings-form";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/settings/popup")({ component: PopupSettings as any });

function PopupSettings() {
  const { form, setForm, isLoading, save } = useSettingsForm();

  if (isLoading)
    return (
      <AdminLayout title="Popup Poster">
        <p className="text-muted-foreground">Loading...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout title="Popup Poster">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Popup Poster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Image</Label>
              <ImageUpload
                value={form.popup.image_url ?? ""}
                onChange={(url) => setForm({ ...form, popup: { ...form.popup, image_url: url } })}
              />
            </div>

            <div>
              <Label>Link (optional)</Label>
              <Input
                value={form.popup.link_url ?? ""}
                onChange={(e) =>
                  setForm({ ...form, popup: { ...form.popup, link_url: e.target.value } })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.popup.is_active}
                onCheckedChange={(v) =>
                  setForm({ ...form, popup: { ...form.popup, is_active: v } })
                }
              />
              <Label>Active</Label>
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

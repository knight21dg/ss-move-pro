import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsForm } from "@/hooks/use-settings-form";

export const Route = createFileRoute("/admin/settings/cta")({
  component: CtaSettings,
});

function CtaSettings() {
  const { form, setForm, isLoading, save } = useSettingsForm();
  if (isLoading)
    return (
      <AdminLayout title="CTA Banner Settings">
        <p className="text-muted-foreground">Loading...</p>
      </AdminLayout>
    );
  return (
    <AdminLayout title="CTA Banner Settings">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Call to Action Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={form.cta.show_banner}
                onCheckedChange={(v) => setForm({ ...form, cta: { ...form.cta, show_banner: v } })}
              />
              <Label>Show Banner</Label>
            </div>
            <div>
              <Label>Banner Text</Label>
              <Input
                value={form.cta.banner_text}
                onChange={(e) =>
                  setForm({ ...form, cta: { ...form.cta, banner_text: e.target.value } })
                }
              />
            </div>
            <div>
              <Label>Banner Subtitle</Label>
              <Textarea
                rows={2}
                value={form.cta.banner_subtitle}
                onChange={(e) =>
                  setForm({ ...form, cta: { ...form.cta, banner_subtitle: e.target.value } })
                }
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={form.cta.banner_button}
                onChange={(e) =>
                  setForm({ ...form, cta: { ...form.cta, banner_button: e.target.value } })
                }
              />
            </div>
            <div>
              <Label>Button Link (e.g. /enquiry)</Label>
              <Input
                value={form.cta.banner_link}
                onChange={(e) =>
                  setForm({ ...form, cta: { ...form.cta, banner_link: e.target.value } })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Button Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Get Free Quote — Background</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  className="w-14 h-10 p-1"
                  value={form.cta.cta_bg_color || "#ffffff"}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, cta_bg_color: e.target.value } })
                  }
                />
                <Input
                  placeholder="#ffffff"
                  value={form.cta.cta_bg_color}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, cta_bg_color: e.target.value } })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Get Free Quote — Text Color</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  className="w-14 h-10 p-1"
                  value={form.cta.cta_text_color || "#000000"}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, cta_text_color: e.target.value } })
                  }
                />
                <Input
                  placeholder="Leave empty for default"
                  value={form.cta.cta_text_color}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, cta_text_color: e.target.value } })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Call Now — Background</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  className="w-14 h-10 p-1"
                  value={form.cta.call_bg_color || "#2563eb"}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, call_bg_color: e.target.value } })
                  }
                />
                <Input
                  placeholder="Leave empty for default"
                  value={form.cta.call_bg_color}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, call_bg_color: e.target.value } })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Call Now — Text Color</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  className="w-14 h-10 p-1"
                  value={form.cta.call_text_color || "#ffffff"}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, call_text_color: e.target.value } })
                  }
                />
                <Input
                  placeholder="Leave empty for default"
                  value={form.cta.call_text_color}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, call_text_color: e.target.value } })
                  }
                />
              </div>
            </div>
            <div>
              <Label>WhatsApp — Background</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  className="w-14 h-10 p-1"
                  value={form.cta.whatsapp_bg_color || "#25D366"}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, whatsapp_bg_color: e.target.value } })
                  }
                />
                <Input
                  placeholder="#25D366"
                  value={form.cta.whatsapp_bg_color}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, whatsapp_bg_color: e.target.value } })
                  }
                />
              </div>
            </div>
            <div>
              <Label>WhatsApp — Text Color</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  className="w-14 h-10 p-1"
                  value={form.cta.whatsapp_text_color || "#ffffff"}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, whatsapp_text_color: e.target.value } })
                  }
                />
                <Input
                  placeholder="Leave empty for default"
                  value={form.cta.whatsapp_text_color}
                  onChange={(e) =>
                    setForm({ ...form, cta: { ...form.cta, whatsapp_text_color: e.target.value } })
                  }
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Leave empty to use default colors. These apply to Get Free Quote, Call Now, and WhatsApp buttons across the site.
            </p>
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

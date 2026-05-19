import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsForm } from "@/hooks/use-settings-form";

export const Route = createFileRoute("/admin/settings/contact")({ component: ContactSettings });

function ContactSettings() {
  const { form, setForm, isLoading, save } = useSettingsForm();

  if (isLoading)
    return (
      <AdminLayout title="Contact Settings">
        <p className="text-muted-foreground">Loading...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout title="Contact Settings">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <div className="flex mt-1.5">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                    +91
                  </span>
                  <Input
                    value={form.contact.phone.replace(/^\+91/, "")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        contact: { ...form.contact, phone: "+91" + e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>WhatsApp</Label>
                <div className="flex mt-1.5">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                    +91
                  </span>
                  <Input
                    value={form.contact.whatsapp.replace(/^\+91/, "")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        contact: { ...form.contact, whatsapp: "+91" + e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={form.contact.email}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, email: e.target.value } })
                }
              />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                rows={2}
                value={form.contact.address}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, address: e.target.value } })
                }
              />
            </div>
            <div>
              <Label>WhatsApp Enquiry Message Template</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Use {"{name}"}, {"{phone}"}, {"{from_city}"}, {"{to_city}"}, {"{service}"},{" "}
                {"{moving_date}"}, {"{message}"} as placeholders.
              </p>
              <Textarea
                rows={3}
                value={form.contact.whatsapp_enquiry_message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contact: { ...form.contact, whatsapp_enquiry_message: e.target.value },
                  })
                }
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

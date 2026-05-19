import { createFileRoute } from "@tanstack/react-router";
import { Plus, Save, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsForm } from "@/hooks/use-settings-form";
import type { SiteSettings } from "@/hooks/use-cms";

export const Route = createFileRoute("/admin/settings/home")({ component: HomeSettings });

function HomeSettings() {
  const { form, setForm, isLoading, save } = useSettingsForm();

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

  if (isLoading) return <AdminLayout title="Home Sections"><p className="text-muted-foreground">Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="Home Sections">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Why Choose Us</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>Our Process</CardTitle></CardHeader>
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
          <CardHeader><CardTitle>FAQ</CardTitle></CardHeader>
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

        <div className="sticky bottom-4 bg-background border border-border rounded-xl p-3 flex justify-end shadow-lg">
          <Button variant="brand" size="lg" onClick={() => save.mutate()} disabled={save.isPending}>
            <Save className="h-4 w-4 mr-2" /> {save.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

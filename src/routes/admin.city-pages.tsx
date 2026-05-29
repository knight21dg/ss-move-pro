import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, MapPin } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCities } from "@/hooks/use-cms";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/city-pages")({ component: AdminCityPages });

type CityForm = {
  id?: string;
  name: string;
  slug: string;
  state: string;
  hero_title: string;
  hero_subtitle: string;
  body: string;
  meta_title: string;
  meta_description: string;
  hero_image: string;
  sort_order: number;
  is_active: boolean;
};

const empty: CityForm = {
  name: "", slug: "", state: "Andhra Pradesh", hero_title: "", hero_subtitle: "",
  body: "", meta_title: "", meta_description: "", hero_image: "", sort_order: 0, is_active: true,
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminCityPages() {
  const { data: cities = [], isLoading } = useCities(false);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<CityForm | null>(null);

  const save = useMutation({
    mutationFn: async (c: CityForm) => {
      const payload = { ...c, slug: c.slug || slugify(c.name), updatedAt: new Date().toISOString() };
      if (c.id) {
        await updateDoc(doc(db, "city_pages", c.id), payload);
      } else {
        const { id: _i, ...rest } = payload;
        await addDoc(collection(db, "city_pages"), rest);
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["city_pages"] }); setEditing(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { await deleteDoc(doc(db, "city_pages", id)); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["city_pages"] }); toast.success("Deleted"); },
  });

  return (
    <AdminLayout title="City Pages">
      <div className="flex justify-between mb-4">
        <p className="text-sm text-muted-foreground">{cities.length} city page{cities.length !== 1 && "s"}</p>
        <Button variant="brand" onClick={() => setEditing(empty)}><Plus className="h-4 w-4 mr-1" /> Add City Page</Button>
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(c as CityForm)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => confirm(`Delete "${c.name}"?`) && del.mutate(c.id!)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <h3 className="font-bold">{c.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">/{c.slug}</p>
              {!c.is_active && <span className="inline-block mt-2 text-xs bg-muted px-2 py-0.5 rounded">Hidden</span>}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit City Page" : "Add City Page"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>City Name</Label>
                  <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })} />
                </div>
                <div>
                  <Label>Slug (URL path)</Label>
                  <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>State</Label>
                  <Input value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} />
                </div>
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <Label>Hero Title</Label>
                <Input value={editing.hero_title} onChange={(e) => setEditing({ ...editing, hero_title: e.target.value })} />
              </div>
              <div>
                <Label>Hero Subtitle</Label>
                <Textarea rows={2} value={editing.hero_subtitle} onChange={(e) => setEditing({ ...editing, hero_subtitle: e.target.value })} />
              </div>
              <div>
                <Label>Body Content</Label>
                <Textarea rows={5} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
              </div>
              <div>
                <Label>Hero Image</Label>
                <ImageUpload folder="uploads" value={editing.hero_image} onChange={(url) => setEditing({ ...editing, hero_image: url })} />
              </div>
              <div>
                <Label>Meta Title (SEO)</Label>
                <Input value={editing.meta_title} onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })} />
              </div>
              <div>
                <Label>Meta Description (SEO)</Label>
                <Textarea rows={2} value={editing.meta_description} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                <Label>Show on website</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="brand" onClick={() => editing && save.mutate(editing)} disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

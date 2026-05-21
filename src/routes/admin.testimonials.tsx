import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useTestimonials } from "@/hooks/use-cms";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/testimonials")({ component: AdminTestimonials });

type T = { id?: string; name: string; location: string; rating: number; message: string; avatar_url: string; sort_order: number; is_active: boolean };
const empty: T = { name: "", location: "", rating: 5, message: "", avatar_url: "", sort_order: 0, is_active: true };

function AdminTestimonials() {
  const { data: items = [], isLoading } = useTestimonials(false);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<T | null>(null);

  const save = useMutation({
    mutationFn: async (it: T) => {
      if (it.id) { const { error } = await (supabase.from("testimonials") as any).update(it).eq("id", it.id); if (error) throw error; }
      else { const { id: _, ...rest } = it; const { error } = await (supabase.from("testimonials") as any).insert(rest); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["testimonials"] }); setEditing(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await (supabase.from("testimonials") as any).delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["testimonials"] }); toast.success("Deleted"); },
  });

  return (
    <AdminLayout title="Testimonials">
      <div className="flex justify-between mb-4">
        <p className="text-sm text-muted-foreground">{items.length} testimonial{items.length !== 1 && "s"}</p>
        <Button variant="brand" onClick={() => setEditing(empty)}><Plus className="h-4 w-4 mr-1" /> Add Testimonial</Button>
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex justify-between mb-2">
                <div className="flex gap-0.5 text-primary">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(t as T)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => confirm("Delete?") && del.mutate(t.id!)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <p className="text-sm line-clamp-3">"{t.message}"</p>
              <div className="mt-3 text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.location}</div>
              {!t.is_active && <span className="inline-block mt-2 text-xs bg-muted px-2 py-0.5 rounded">Hidden</span>}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div><Label>Location</Label><Input value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></div>
              </div>
              <div><Label>Message</Label><Textarea rows={4} value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} /></div>
                <div><Label>Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
              </div>
              <div><Label>Avatar (optional)</Label><ImageUpload folder="avatars" value={editing.avatar_url} onChange={(url) => setEditing({ ...editing, avatar_url: url })} /></div>
              <div className="flex items-center gap-2"><Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /> <Label>Show on website</Label></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="brand" onClick={() => editing && save.mutate(editing)} disabled={save.isPending}>{save.isPending ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useGallery } from "@/hooks/use-cms";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/gallery")({ component: AdminGallery });

type Item = { id?: string; title: string; image_url: string; category: string; sort_order: number; is_active: boolean };
const empty: Item = { title: "", image_url: "", category: "", sort_order: 0, is_active: true };

function AdminGallery() {
  const { data: items = [], isLoading } = useGallery(false);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Item | null>(null);

  const save = useMutation({
    mutationFn: async (it: Item) => {
      if (!it.image_url) throw new Error("Image required");
      if (it.id) {
        await updateDoc(doc(db, "gallery_images", it.id), it);
      } else {
        await addDoc(collection(db, "gallery_images"), it);
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["gallery"] }); setEditing(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "gallery_images", id));
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["gallery"] }); toast.success("Deleted"); },
  });

  return (
    <AdminLayout title="Gallery">
      <div className="flex justify-between mb-4">
        <p className="text-sm text-muted-foreground">{items.length} image{items.length !== 1 && "s"}</p>
        <Button variant="brand" onClick={() => setEditing(empty)}><Plus className="h-4 w-4 mr-1" /> Add Image</Button>
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border border-border bg-card overflow-hidden group">
              <div className="aspect-square overflow-hidden">
                <img src={it.image_url} alt={it.title ?? ""} className="h-full w-full object-cover" />
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{it.title || "Untitled"}</div>
                  <div className="text-xs text-muted-foreground truncate">{it.category}</div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(it as Item)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => confirm("Delete this image?") && del.mutate(it.id!)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              {!it.is_active && <div className="px-3 pb-2"><span className="text-xs bg-muted px-2 py-0.5 rounded">Hidden</span></div>}
            </div>
          ))}
        </div>
      )}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg" aria-describedby={undefined}>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Image" : "Add Image"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Image</Label><ImageUpload folder="gallery" value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} /></div>
              <div><Label>Title (optional)</Label><Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Category</Label><Input placeholder="e.g. Packing" value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
                <div><Label>Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
              </div>
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

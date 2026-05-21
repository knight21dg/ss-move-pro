import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useVideos } from "@/hooks/use-cms";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/videos")({ component: AdminVideos });

type V = {
  id?: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  sort_order: number;
  is_active: boolean;
};
const empty: V = {
  title: "",
  description: "",
  video_url: "",
  thumbnail_url: "",
  sort_order: 0,
  is_active: true,
};

function getYoutubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return m?.[1];
}

function AdminVideos() {
  const { data: videos = [], isLoading } = useVideos(false);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<V | null>(null);

  const save = useMutation({
    mutationFn: async (v: V) => {
      if (!getYoutubeId(v.video_url)) throw new Error("Provide a valid YouTube URL");
      if (v.id) {
        const { error } = await (supabase.from("videos") as any).update(v).eq("id", v.id);
        if (error) throw error;
      } else {
        const { id: _, ...rest } = v;
        const { error } = await (supabase.from("videos") as any).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["videos"] });
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("videos") as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Deleted");
    },
  });

  return (
    <AdminLayout title="Videos">
      <div className="flex justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {videos.length} video{videos.length !== 1 && "s"}
        </p>
        <Button variant="brand" onClick={() => setEditing(empty)}>
          <Plus className="h-4 w-4 mr-1" /> Add Video
        </Button>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => {
            const id = getYoutubeId(v.video_url);
            return (
              <div key={v.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="aspect-video bg-black">
                  {id && (
                    <img
                      src={v.thumbnail_url || `https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                      alt={v.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{v.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {v.description}
                    </p>
                    {!v.is_active && (
                      <span className="inline-block mt-2 text-xs bg-muted px-2 py-0.5 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(v as V)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => confirm(`Delete "${v.title}"?`) && del.mutate(v.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Video" : "Add Video"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div>
                <Label>YouTube URL</Label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={editing.video_url}
                  onChange={(e) => setEditing({ ...editing, video_url: e.target.value })}
                />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea
                  rows={2}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Thumbnail URL (optional — auto from YouTube)</Label>
                <ImageUpload
                  folder="videos"
                  value={editing.thumbnail_url ?? ""}
                  onChange={(url) => setEditing({ ...editing, thumbnail_url: url })}
                />
              </div>
              <div className="flex justify-between items-end gap-4">
                <div className="flex-1">
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <Switch
                    checked={editing.is_active}
                    onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                  />{" "}
                  <Label>Active</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={() => editing && save.mutate(editing)}
              disabled={save.isPending}
            >
              {save.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

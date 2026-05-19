import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, Trash2, MapPin, Calendar, MessageCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/enquiries")({ component: AdminEnquiries });

const statusColors: Record<string, string> = {
  new: "bg-primary text-primary-foreground",
  contacted: "bg-amber-500 text-white",
  closed: "bg-muted text-muted-foreground",
};

function AdminEnquiries() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<any | null>(null);

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["enquiries", filter],
    queryFn: async () => {
      let q = supabase.from("enquiries").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter as any);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async (p: { id: string; status?: string; admin_notes?: string }) => {
      const { id, ...rest } = p;
      const { error } = await supabase.from("enquiries").update(rest as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["enquiries"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); toast.success("Updated"); setSelected(null); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("enquiries").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["enquiries"] }); toast.success("Deleted"); setSelected(null); },
  });

  return (
    <AdminLayout title="Enquiries">
      <div className="flex flex-wrap justify-between gap-3 mb-4">
        <p className="text-sm text-muted-foreground">{enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"}</p>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading...</p> : enquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">No enquiries yet</div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e: any) => (
            <button key={e.id} onClick={() => setSelected(e)} className="w-full text-left rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-bold">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${statusColors[e.status] ?? ""}`}>{e.status}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex gap-2 items-center"><Phone className="h-3.5 w-3.5" /> {e.phone}</div>
                {e.email && <div className="flex gap-2 items-center"><Mail className="h-3.5 w-3.5" /> {e.email}</div>}
                {e.service && <div className="flex gap-2 items-center"><span className="font-medium text-foreground">{e.service}</span></div>}
                {(e.from_city || e.to_city) && <div className="flex gap-2 items-center"><MapPin className="h-3.5 w-3.5" /> {e.from_city} → {e.to_city}</div>}
                {e.moving_date && <div className="flex gap-2 items-center"><Calendar className="h-3.5 w-3.5" /> {e.moving_date}</div>}
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Enquiry from {selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div><span className="font-semibold">Phone:</span> <a className="text-primary" href={`tel:${selected.phone}`}>{selected.phone}</a></div>
              {selected.email && <div><span className="font-semibold">Email:</span> <a className="text-primary" href={`mailto:${selected.email}`}>{selected.email}</a></div>}
              {selected.service && <div><span className="font-semibold">Service:</span> {selected.service}</div>}
              {(selected.from_city || selected.to_city) && <div><span className="font-semibold">Move:</span> {selected.from_city} → {selected.to_city}</div>}
              {selected.moving_date && <div><span className="font-semibold">Date:</span> {selected.moving_date}</div>}
              {selected.message && <div><span className="font-semibold">Message:</span><p className="mt-1 p-3 bg-muted rounded">{selected.message}</p></div>}
              <div>
                <Label>Status</Label>
                <Select value={selected.status} onValueChange={(v) => setSelected({ ...selected, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Admin Notes</Label>
                <Textarea rows={3} value={selected.admin_notes ?? ""} onChange={(e) => setSelected({ ...selected, admin_notes: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter className="flex-wrap gap-2">
            <Button variant="ghost" className="text-destructive mr-auto" onClick={() => selected && confirm("Delete this enquiry?") && del.mutate(selected.id)}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            {selected?.phone && (
              <Button variant="outline" asChild>
                <a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                </a>
              </Button>
            )}
            <Button variant="brand" onClick={() => selected && update.mutate({ id: selected.id, status: selected.status, admin_notes: selected.admin_notes })}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

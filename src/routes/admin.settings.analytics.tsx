import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/analytics")({ component: AnalyticsSettings });

function AnalyticsSettings() {
  const qc = useQueryClient();
  const { data: gaId = "", isLoading } = useQuery({
    queryKey: ["ga_settings"],
    queryFn: async () => {
      const snap = await getDoc(doc(db, "ga_settings", "singleton"));
      return (snap.data() as { ga_measurement_id?: string } | undefined)?.ga_measurement_id ?? "";
    },
  });

  const save = useMutation({
    mutationFn: async (newId: string) => {
      await setDoc(doc(db, "ga_settings", "singleton"), { ga_measurement_id: newId }, { merge: true });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ga_settings"] });
      toast.success("Saved");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  if (isLoading)
    return (
      <AdminLayout title="Analytics Settings">
        <p className="text-muted-foreground">Loading...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout title="Analytics Settings">
      <div className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle>Google Analytics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>GA Measurement ID (e.g. G-XXXXXXXXXX)</Label>
              <Input placeholder="G-" value={gaId} onChange={(e) => qc.setQueryData(["ga_settings"], { ga_measurement_id: e.target.value })} />
            </div>
          </CardContent>
        </Card>
        <div className="sticky bottom-4 bg-background border border-border rounded-xl p-3 flex justify-end shadow-lg">
          <Button variant="brand" size="lg" onClick={() => save.mutate(gaId)} disabled={save.isPending}>
            <Save className="h-4 w-4 mr-2" /> {save.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

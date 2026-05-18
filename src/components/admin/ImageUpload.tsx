import { useState } from "react";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ImageUpload({ value, onChange, folder = "uploads" }: { value?: string | null; onChange: (url: string) => void; folder?: string }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: false });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("site-media").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    toast.success("Image uploaded");
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-32 w-32 object-cover rounded-md border" />
          <button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <Button asChild type="button" variant="outline" size="sm" disabled={uploading}>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : "Upload"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
        </Button>
        <Input placeholder="or paste image URL" value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="flex-1" />
      </div>
    </div>
  );
}

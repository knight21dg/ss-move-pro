import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Image as ImageIcon, Video, MessageSquare, Inbox, Settings as SettingsIcon } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [s, g, v, t, e, eNew] = await Promise.all([
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
        supabase.from("videos").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      return { services: s.count ?? 0, gallery: g.count ?? 0, videos: v.count ?? 0, testimonials: t.count ?? 0, enquiries: e.count ?? 0, newEnquiries: eNew.count ?? 0 };
    },
  });

  const cards = [
    { to: "/admin/services", label: "Services", icon: Package, count: stats?.services },
    { to: "/admin/gallery", label: "Gallery Images", icon: ImageIcon, count: stats?.gallery },
    { to: "/admin/videos", label: "Videos", icon: Video, count: stats?.videos },
    { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquare, count: stats?.testimonials },
    { to: "/admin/enquiries", label: "Enquiries", icon: Inbox, count: stats?.enquiries, badge: stats?.newEnquiries },
    { to: "/admin/settings", label: "Settings Overview", icon: SettingsIcon, count: null },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.to} to={c.to as any} className="rounded-xl border border-border bg-card p-6 hover:shadow-md hover:border-primary transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                {!!c.badge && <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full px-2 py-0.5">{c.badge} new</span>}
              </div>
              <div className="text-sm text-muted-foreground">{c.label}</div>
              {c.count !== null && <div className="text-3xl font-extrabold mt-1">{c.count ?? "—"}</div>}
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}

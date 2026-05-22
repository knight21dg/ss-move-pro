import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Image as ImageIcon, Video, MessageSquare, Inbox, Settings as SettingsIcon } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { collection, query, getDocs, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function count(collectionName: string, filterWhere?: { field: string; value: any }): Promise<number> {
  const q = filterWhere
    ? query(collection(db, collectionName), where(filterWhere.field, "==", filterWhere.value), limit(1))
    : query(collection(db, collectionName), limit(1));
  return getDocs(q).then((snap) => snap.size);
}

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [s, g, v, t, e, eNew] = await Promise.all([
        count("services"),
        count("gallery_images"),
        count("videos"),
        count("testimonials"),
        count("enquiries"),
        count("enquiries", { field: "status", value: "new" }),
      ]);
      return { services: s, gallery: g, videos: v, testimonials: t, enquiries: e, newEnquiries: eNew };
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
                <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-5 w-5" /></div>
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

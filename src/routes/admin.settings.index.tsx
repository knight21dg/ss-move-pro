import { createFileRoute, Link } from "@tanstack/react-router";
import { Image, LayoutList, Info, Phone, Share2, Search, Megaphone, FileText, BarChart3 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/settings/")({ component: SettingsHub });

const cards = [
  {
    to: "/admin/settings/hero",
    label: "Hero",
    description: "Home hero text and all page hero background images.",
    icon: Image,
  },
  {
    to: "/admin/settings/home",
    label: "Home Sections",
    description: "Why Choose Us, Our Process, and FAQ content.",
    icon: LayoutList,
  },
  {
    to: "/admin/settings/about",
    label: "About",
    description: "About section heading, body, and stats.",
    icon: Info,
  },
  {
    to: "/admin/settings/contact",
    label: "Contact",
    description: "Phone, WhatsApp, email, address and enquiry template.",
    icon: Phone,
  },
  {
    to: "/admin/settings/social",
    label: "Social Links",
    description: "Facebook, Instagram, and YouTube links.",
    icon: Share2,
  },
  {
    to: "/admin/settings/seo",
    label: "SEO",
    description: "Default SEO and per-page metadata.",
    icon: Search,
  },
  {
    to: "/admin/settings/cta",
    label: "CTA Banner",
    description: "Call-to-action banner text and button.",
    icon: Megaphone,
  },
  {
    to: "/admin/settings/footer",
    label: "Footer",
    description: "Footer description and quick links.",
    icon: FileText,
  },
  {
    to: "/admin/settings/analytics",
    label: "Analytics",
    description: "Google Analytics measurement ID.",
    icon: BarChart3,
  },
];

function SettingsHub() {
  return (
    <AdminLayout title="Site Settings">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.to} to={c.to as any} className="rounded-xl border border-border bg-card p-6 hover:shadow-md hover:border-primary transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-sm font-semibold">{c.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.description}</div>
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}

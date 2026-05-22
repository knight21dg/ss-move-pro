import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSettings } from "@/hooks/use-cms";

/** Map footer quick-link labels → public routes */
const QUICK_LINK_MAP: Record<string, string> = {
  home: "/",
  services: "/services",
  about: "/about",
  contact: "/contact",
  enquiry: "/enquiry",
  gallery: "/gallery",
  videos: "/videos",
  "about us": "/about",
  "get free quote": "/enquiry",
  "get a quote": "/enquiry",
  "free quote": "/enquiry",
};

function parseQuickLinks(text: string | null | undefined): { label: string; href: string }[] {
  if (!text) return [];
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((label) => {
      const href = QUICK_LINK_MAP[label.toLowerCase()] || "/";
      return { label, href };
    });
}

const SOCIAL_LINKS = [
  { Icon: Facebook, key: "facebook", label: "Facebook" },
  { Icon: Instagram, key: "instagram", label: "Instagram" },
  { Icon: Youtube, key: "youtube", label: "YouTube" },
] as const;

export function Footer() {
  const { data: s } = useSettings();
  const contact = s?.contact;
  const social = s?.social;
  const footer = s?.footer;
  const quickLinks = parseQuickLinks(footer?.quick_links);

  return (
    <footer className="bg-gradient-dark text-white mt-24">
      <div className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-3 inline-block">
            <img src={logo} alt="SS Packers & Movers" className="h-12 w-auto" />
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            {footer?.description || contact?.address || ""}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
          {quickLinks.length > 0 ? (
            <ul className="space-y-2 text-sm text-white/70">
              {quickLinks.map(({ label, href }) => (
                <li key={`${label}-${href}`}>
                  <Link to={href} className="hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/50">No links configured.</p>
          )}
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Services</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Household Shifting</li>
            <li>Office Relocation</li>
            <li>Bike Transportation</li>
            <li>Car Transportation</li>
            <li>Loading &amp; Unloading</li>
            <li className="text-white/40">Warehouse Storage</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-white/70">
            {contact?.address && <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>{contact.address}</span></li>}
            {contact?.phone && <li className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>{contact.phone}</span></li>}
            {contact?.email && <li className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>{contact.email}</span></li>}
          </ul>
          <div className="flex gap-3 mt-5">
            {SOCIAL_LINKS.map(({ Icon, key, label }) => {
              const href = social?.[key];
              if (!href) return null;
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="h-9 w-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 text-xs text-white/60 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} SS Packers &amp; Movers, Kakinada. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

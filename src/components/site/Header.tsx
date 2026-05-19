import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-cms";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/videos", label: "Videos" },
  { to: "/enquiry", label: "Enquiry" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { data: s } = useSettings();
  const phone = s?.contact?.phone;
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SS Packers & Movers" className="h-12 w-auto" />
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm font-semibold text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          {isAdmin && (
            <Button asChild variant="outline" size="sm">
              <Link to="/admin"><LayoutDashboard className="h-4 w-4 mr-1" /> Admin</Link>
            </Button>
          )}
          {phone && (
            <a href={phoneHref} className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary">
              <Phone className="h-4 w-4" /> {phone}
            </a>
          )}
          <Button asChild variant="brand" size="lg">
            <Link to="/enquiry">Get Free Quote</Link>
          </Button>
        </div>
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="px-3 py-3 rounded-md text-sm font-medium hover:bg-muted">Admin Panel</Link>
            )}
            <Button asChild variant="brand" className="mt-2">
              <Link to="/enquiry" onClick={() => setOpen(false)}>Get Free Quote</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

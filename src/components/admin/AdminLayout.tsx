import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  Video,
  MessageSquare,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  LayoutList,
  Info,
  Phone,
  Share2,
  Search,
  Megaphone,
  FileText,
  BarChart3,
  ShieldCheck,
  MapPin,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const mainNav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/services", label: "Services", icon: Package },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/videos", label: "Videos", icon: Video },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
];

const settingsNav: { to: string; label: string; icon: typeof Settings }[] = [
  { to: "/admin/settings", label: "Overview", icon: Settings },
  { to: "/admin/settings/hero", label: "Hero", icon: ImageIcon },
  { to: "/admin/settings/home", label: "Home Sections", icon: LayoutList },
  { to: "/admin/settings/about", label: "About", icon: Info },
  { to: "/admin/settings/contact", label: "Contact", icon: Phone },
  { to: "/admin/settings/social", label: "Social Links", icon: Share2 },
  { to: "/admin/settings/seo", label: "SEO", icon: Search },
  { to: "/admin/settings/cta", label: "CTA Banner", icon: Megaphone },
  { to: "/admin/settings/popup", label: "Popup Poster", icon: Megaphone },
  { to: "/admin/settings/footer", label: "Footer", icon: FileText },
  { to: "/admin/settings/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings/trust", label: "Trust Ribbon", icon: ShieldCheck },
  { to: "/admin/city-pages", label: "City Pages", icon: MapPin },
];

function NavLink({
  to,
  label,
  icon: Icon,
  exact,
  onClick,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = exact ? pathname === to : pathname.startsWith(to);
  return (
    <Link
      to={to as any}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground/70 hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin" });
  }, [loading, user, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || isAdmin === null)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <p className="text-sm text-muted-foreground">
            Your account ({user.email}) does not have admin privileges.
          </p>
          <div className="bg-muted p-4 rounded-xl border border-border text-left space-y-2">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
              How to promote this account:
            </p>
            <p className="text-xs text-muted-foreground">
              Go to your Firebase Firestore console and create a document in the{" "}
              <code className="bg-background px-1.5 py-0.5 rounded font-mono text-[11px] border border-border">
                user_roles
              </code>{" "}
              collection:
            </p>
            <div className="space-y-1.5 text-xs">
              <div>
                <strong>Document ID (UID):</strong>{" "}
                <code className="bg-background px-1.5 py-0.5 rounded font-mono text-[11px] border border-border select-all">
                  {user.uid}
                </code>
              </div>
              <div>
                <strong>Field:</strong>{" "}
                <code className="bg-background px-1.5 py-0.5 rounded font-mono text-[11px] border border-border">
                  role
                </code>{" "}
                (string)
              </div>
              <div>
                <strong>Value:</strong>{" "}
                <code className="bg-background px-1.5 py-0.5 rounded font-mono text-[11px] border border-border">
                  admin
                </code>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              await logout();
              navigate({ to: "/signin" });
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  async function signOut() {
    await logout();
    navigate({ to: "/signin" });
  }

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="" className="h-9 w-auto" />
          <div className="font-bold text-sm leading-tight">
            SS Packers
            <br />
            <span className="text-xs text-muted-foreground font-normal">Admin Panel</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1">
          Content
        </div>
        {mainNav.map((it) => (
          <NavLink key={it.to} {...it} onClick={() => setMobileOpen(false)} />
        ))}

        <div className="pt-3">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
          >
            {settingsOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
            <Settings className="h-4 w-4 shrink-0" />
            <span className="truncate">Settings</span>
          </button>
          {settingsOpen && (
            <div className="ml-2 mt-1 space-y-1 pl-4 border-l border-border">
              {settingsNav.map((it) => (
                <NavLink key={it.to} {...it} onClick={() => setMobileOpen(false)} />
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        <Button asChild variant="outline" size="sm" className="w-full justify-start">
          <Link to="/">
            <ExternalLink className="h-4 w-4 mr-2" /> View Site
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex md:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="" className="h-9 w-auto" />
            <div className="font-bold text-sm leading-tight">
              SS Packers
              <br />
              <span className="text-xs text-muted-foreground font-normal">Admin Panel</span>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded-md hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-md hover:bg-muted"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg md:text-xl font-bold truncate">{title}</h1>
          </div>
          <div className="text-sm text-muted-foreground hidden sm:block truncate">
            {user.email}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}

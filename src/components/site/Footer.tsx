import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSettings } from "@/hooks/use-cms";

export function Footer() {
  const { data: s } = useSettings();
  const contact = s?.contact;
  const social = s?.social;
  const footer = s?.footer;

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
          <ul className="space-y-2 text-sm text-white/70">
            {[
              ["/about", "About Us"],
              ["/services", "Services"],
              ["/gallery", "Gallery"],
              ["/enquiry", "Get a Quote"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-primary transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Services</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Household Shifting</li>
            <li>Office Relocation</li>
            <li>Car Transportation</li>
            <li>Warehouse Storage</li>
            <li>Loading &amp; Unloading</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-white">Contact</h4>
          {contact ? (
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-3">{contact.address && <><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>{contact.address}</span></>}</li>
              <li className="flex gap-3">{contact.phone && <><Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>{contact.phone}</span></>}</li>
              <li className="flex gap-3">{contact.email && <><Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span>{contact.email}</span></>}</li>
            </ul>
          ) : (
            <p className="text-sm text-white/50">Loading contact details…</p>
          )}
          <div className="flex gap-3 mt-5">
            {[
              { Icon: Facebook, href: social?.facebook },
              { Icon: Instagram, href: social?.instagram },
              { Icon: Youtube, href: social?.youtube },
            ].map(({ Icon, href }, i) => (
              <a key={i} href={href || "#"} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
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

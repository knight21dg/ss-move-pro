import { MessageCircle, Phone } from "lucide-react";

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href="https://wa.me/919876543210?text=Hi%20SS%20Packers%20%26%20Movers%2C%20I%27d%20like%20a%20quote"
        target="_blank" rel="noreferrer"
        aria-label="WhatsApp"
        className="h-14 w-14 rounded-full bg-[oklch(0.7_0.18_145)] text-white flex items-center justify-center shadow-brand hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href="tel:+919876543210"
        aria-label="Call"
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-brand hover:scale-110 transition-transform"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}

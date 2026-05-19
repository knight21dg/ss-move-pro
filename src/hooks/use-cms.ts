import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useServices(activeOnly = true) {
  return useQuery({
    queryKey: ["services", activeOnly],
    queryFn: async () => {
      let q = supabase.from("services").select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGallery(activeOnly = true) {
  return useQuery({
    queryKey: ["gallery", activeOnly],
    queryFn: async () => {
      let q = supabase.from("gallery_images").select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useVideos(activeOnly = true) {
  return useQuery({
    queryKey: ["videos", activeOnly],
    queryFn: async () => {
      let q = supabase.from("videos").select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTestimonials(activeOnly = true) {
  return useQuery({
    queryKey: ["testimonials", activeOnly],
    queryFn: async () => {
      let q = supabase.from("testimonials").select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export type SeoFields = { title: string; description: string; keywords: string; og_image: string };

export type SiteSettings = {
  hero: { title: string; subtitle: string; cta: string };
  hero_images: { home: string; about: string; services: string; gallery: string; videos: string; enquiry: string; contact: string };
  home_why_us: { eyebrow: string; title: string; items: { title: string; desc: string }[] };
  home_process: { eyebrow: string; title: string; items: { step: string; title: string; desc: string }[] };
  home_faqs: { eyebrow: string; title: string; items: { question: string; answer: string }[] };
  about: { heading: string; body: string; years_experience: string; happy_customers: string; cities_covered: string };
  contact: { phone: string; whatsapp: string; email: string; address: string; whatsapp_enquiry_message: string };
  social: { facebook: string; instagram: string; youtube: string };
  seo: {
    default: SeoFields;
    pages: {
      home: SeoFields;
      about: SeoFields;
      services: SeoFields;
      gallery: SeoFields;
      videos: SeoFields;
      enquiry: SeoFields;
      contact: SeoFields;
    };
  };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  hero: { title: "SS Packers & Movers", subtitle: "Trusted Relocation in Kakinada & Across India", cta: "Get Free Quote" },
  hero_images: { home: "", about: "", services: "", gallery: "", videos: "", enquiry: "", contact: "" },
  home_why_us: {
    eyebrow: "Why Choose Us",
    title: "Moving made simple, safe and stress-free",
    items: [
      { title: "Safe & Insured", desc: "Every shipment is handled with care and fully insured for peace of mind." },
      { title: "On-Time Delivery", desc: "We respect deadlines. Scheduled and delivered on time, every time." },
      { title: "Trained Professionals", desc: "Skilled packers and movers trained in modern handling techniques." },
      { title: "Pan-India Network", desc: "Dedicated fleet covering Kakinada and all major Indian cities." },
    ],
  },
  home_process: {
    eyebrow: "Our Process",
    title: "A simple 4-step move",
    items: [
      { step: "01", title: "Get a Free Quote", desc: "Share your move details and receive a transparent estimate within hours." },
      { step: "02", title: "Survey & Plan", desc: "Our team plans packing, manpower and the right vehicle for your move." },
      { step: "03", title: "Pack & Load", desc: "Professional packing with quality materials. Safe loading by trained crew." },
      { step: "04", title: "Transport & Deliver", desc: "Careful unloading and unpacking at your new place." },
    ],
  },
  home_faqs: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      { question: "Do you provide service across India?", answer: "Yes — we offer relocation, vehicle transport and warehousing across all major Indian cities from our Kakinada hub." },
      { question: "How are charges calculated?", answer: "Charges depend on distance, volume of goods, type of service, packing material and floor access. Get a free transparent quote with no hidden fees." },
      { question: "Is my shipment insured?", answer: "Yes, we offer transit insurance options to fully cover your goods during shifting." },
      { question: "How long does household shifting take?", answer: "Local moves are usually completed in 1 day. Intercity moves take 2–7 days depending on distance." },
    ],
  },
  about: { heading: "About SS Packers & Movers", body: "We are a trusted relocation company based in Kakinada.", years_experience: "10+", happy_customers: "5000+", cities_covered: "100+" },
  contact: { phone: "+91 9876543210", whatsapp: "+91 9876543210", email: "info@sspackersmovers.in", address: "Kakinada, Andhra Pradesh, India", whatsapp_enquiry_message: "Hi, I’m interested in your services. Can I get a quote?" },
  social: { facebook: "", instagram: "", youtube: "" },
  seo: {
    default: {
      title: "SS Packers & Movers Kakinada | Trusted Relocation & Transport",
      description: "Professional packers & movers in Kakinada — household shifting, office relocation, car transport, warehouse storage. Get a free quote today.",
      keywords: "packers and movers Kakinada, movers Kakinada, household shifting Kakinada, car transport Andhra Pradesh, office relocation Kakinada",
      og_image: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e",
    },
    pages: {
      home: {
        title: "SS Packers & Movers Kakinada | Trusted Relocation & Transport",
        description: "Professional packers & movers in Kakinada — household shifting, office relocation, car transport, warehouse storage. Get a free quote today.",
        keywords: "packers and movers Kakinada, movers Kakinada, household shifting Kakinada, car transport Andhra Pradesh, office relocation Kakinada",
        og_image: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e",
      },
      about: {
        title: "About SS Packers & Movers Kakinada",
        description: "Learn about SS Packers & Movers — Kakinada's trusted relocation company serving households and businesses across India.",
        keywords: "about SS Packers & Movers, Kakinada movers, relocation company Kakinada",
        og_image: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e",
      },
      services: {
        title: "Services — SS Packers & Movers Kakinada",
        description: "Household shifting, office relocation, car transport, warehousing, loading & unloading and more — across India from Kakinada.",
        keywords: "moving services Kakinada, office relocation, household shifting, vehicle transport",
        og_image: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e",
      },
      gallery: {
        title: "Gallery — SS Packers & Movers",
        description: "Photos from our packing, moving, warehousing and vehicle transport operations.",
        keywords: "packers movers gallery, relocation photos, moving company Kakinada",
        og_image: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e",
      },
      videos: {
        title: "Videos — SS Packers & Movers",
        description: "Watch how SS Packers & Movers handles your relocation.",
        keywords: "packers movers videos, relocation process, moving company videos",
        og_image: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e",
      },
      enquiry: {
        title: "Get a Free Quote — SS Packers & Movers Kakinada",
        description: "Tell us about your move and get a free, no-obligation quote from SS Packers & Movers.",
        keywords: "moving quote Kakinada, relocation estimate, packers movers enquiry",
        og_image: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e",
      },
      contact: {
        title: "Contact SS Packers & Movers Kakinada",
        description: "Reach SS Packers & Movers in Kakinada — phone, WhatsApp, email and address.",
        keywords: "contact packers movers Kakinada, moving company phone, relocation contact",
        og_image: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/d064612a-e467-4d5d-9eb9-00159ad5972e",
      },
    },
  },
};

export function useSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const out: any = { ...DEFAULT_SETTINGS };
      for (const row of data ?? []) {
        out[row.key] = { ...(out[row.key] ?? {}), ...(row.value as any) };
      }
      return out as SiteSettings;
    },
  });
}
